package com.lifeline.ticketing.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.lifeline.ticketing.user.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Verifying test user passwords...");
        updatePasswordIfNeeded("priya@apollo.in", "password");
        updatePasswordIfNeeded("rahul@remoteit.in", "password");
        updatePasswordIfNeeded("sunita@remoteit.in", "password");
        updatePasswordIfNeeded("admin@lifeline.local", "password");
        log.info("Test user passwords verified.");
    }

    private void updatePasswordIfNeeded(String email, String plainPassword) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String currentHash = user.getPasswordHash();
            if (currentHash == null || !passwordEncoder.matches(plainPassword, currentHash)) {
                user.setPasswordHash(passwordEncoder.encode(plainPassword));
                userRepository.save(user);
                log.info("Updated password for {}", email);
            } else {
                log.debug("Password OK for {}", email);
            }
        });
    }
}