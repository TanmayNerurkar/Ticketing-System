package com.lifeline.ticketing.auth;

import com.lifeline.ticketing.common.exception.ValidationException;
import com.lifeline.ticketing.notification.NotificationSender;
import com.lifeline.ticketing.user.User;
import com.lifeline.ticketing.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationSender notificationSender;
    private final StringRedisTemplate redisTemplate;

    @Value("${app.frontend-base-url:http://localhost:3000}")
    private String frontendBaseUrl;

    @Value("${app.password-reset.expiry-minutes:30}")
    private long expiryMinutes;

    @Value("${app.password-reset.rate-limit-max:3}")
    private long rateLimitMax;

    @Value("${app.password-reset.rate-limit-window-minutes:15}")
    private long rateLimitWindowMinutes;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Transactional
    public void requestReset(String email) {
        String normalizedEmail = email.trim().toLowerCase();

        String rateKey = "pwreset:rate:" + normalizedEmail;
        Long attempts = redisTemplate.opsForValue().increment(rateKey);
        if (attempts != null && attempts == 1L) {
            redisTemplate.expire(rateKey, Duration.ofMinutes(rateLimitWindowMinutes));
        }
        if (attempts != null && attempts > rateLimitMax) {
            log.warn("Password reset rate limit exceeded for {}", normalizedEmail);
            return;
        }

        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);
        if (userOpt.isEmpty()) {
            log.info("Password reset requested for non-existent email {}", normalizedEmail);
            return;
        }

        User user = userOpt.get();
        if (!user.isActive() || user.isDeleted()) {
            log.info("Password reset requested for inactive user {}", normalizedEmail);
            return;
        }

        tokenRepository.invalidateAllForUser(user.getId());

        byte[] randomBytes = new byte[32];
        RANDOM.nextBytes(randomBytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        PasswordResetToken token = new PasswordResetToken();
        token.setUserId(user.getId());
        token.setTokenHash(sha256(rawToken));
        token.setExpiresAt(Instant.now().plus(Duration.ofMinutes(expiryMinutes)));
        token.setCreatedAt(Instant.now());
        tokenRepository.save(token);

        String resetLink = frontendBaseUrl + "/reset-password?token=" + rawToken;
        String subject = "Reset your Lifeline password";
        String body = "Hello " + user.getFullName() + ",\n\n"
                + "We received a request to reset your password. "
                + "Click the link below to choose a new password:\n\n"
                + resetLink + "\n\n"
                + "This link will expire in " + expiryMinutes + " minutes. "
                + "If you did not request this, you can safely ignore this email.\n\n"
                + "-- Lifeline IT Support";

        notificationSender.send(user.getEmail(), subject, body);
        log.info("Password reset link sent to {}", normalizedEmail);
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        String tokenHash = sha256(rawToken);

        PasswordResetToken token = tokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new ValidationException("Invalid or expired reset link"));

        if (token.isUsed()) {
            throw new ValidationException("This reset link has already been used");
        }
        if (token.isExpired()) {
            throw new ValidationException("This reset link has expired");
        }

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new ValidationException("Invalid or expired reset link"));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        token.setUsedAt(Instant.now());
        tokenRepository.save(token);

        log.info("Password successfully reset for {}", user.getEmail());
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}
