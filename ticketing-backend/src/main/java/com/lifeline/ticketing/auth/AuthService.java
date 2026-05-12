package com.lifeline.ticketing.auth;

import com.lifeline.ticketing.common.exception.ValidationException;
import com.lifeline.ticketing.user.User;
import com.lifeline.ticketing.user.UserRepository;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.issuer}")
    private String issuer;

    @Value("${app.jwt.expiry-minutes}")
    private long expiryMinutes;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ValidationException("Invalid credentials"));

        if (!user.isActive() || user.isDeleted()) {
            throw new ValidationException("Account is disabled");
        }
        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ValidationException("Invalid credentials");
        }

        long expiresIn = expiryMinutes * 60;
        String token = generateToken(user);

        return new LoginResponse(token, expiresIn, toMeResponse(user));
    }

    public MeResponse me(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ValidationException("User not found"));
        return toMeResponse(user);
    }

    private String generateToken(User user) {
        try {
            Instant now = Instant.now();
            Instant exp = now.plus(expiryMinutes, ChronoUnit.MINUTES);

            JWTClaimsSet.Builder claims = new JWTClaimsSet.Builder()
                    .issuer(issuer)
                    .subject(user.getId().toString())
                    .claim("email", user.getEmail())
                    .claim("role", user.getRole().name())
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(exp));

            if (user.getOrganization() != null) {
                claims.claim("orgId", user.getOrganization().getId().toString());
            }

            SignedJWT jwt = new SignedJWT(
                    new JWSHeader(JWSAlgorithm.HS256),
                    claims.build()
            );
            JWSSigner signer = new MACSigner(secret.getBytes(StandardCharsets.UTF_8));
            jwt.sign(signer);
            return jwt.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException("Failed to generate JWT", e);
        }
    }

    private MeResponse toMeResponse(User user) {
        MeResponse.OrganizationSummary orgSummary = user.getOrganization() == null ? null
                : new MeResponse.OrganizationSummary(
                user.getOrganization().getId(),
                user.getOrganization().getName(),
                user.getOrganization().getType().name());

        return new MeResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                orgSummary
        );
    }
}