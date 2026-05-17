package com.lifeline.ticketing.user;

import com.lifeline.ticketing.common.exception.ResourceNotFoundException;
import com.lifeline.ticketing.common.exception.ValidationException;
import com.lifeline.ticketing.common.security.AuthenticatedUser;
import com.lifeline.ticketing.organization.Organization;
import com.lifeline.ticketing.organization.OrganizationRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository repository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String PWD_CHARS =
            "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    @GetMapping
    public List<UserDto> list(@AuthenticationPrincipal AuthenticatedUser caller) {
        List<User> users = repository.findAll();
        if (!"ADMIN".equals(caller.role())) {
            users = users.stream()
                    .filter(u -> u.getOrganization() != null
                            && caller.organizationId() != null
                            && u.getOrganization().getId().equals(caller.organizationId()))
                    .toList();
        }
        return users.stream().map(UserDto::from).toList();
    }

    @GetMapping("/{id}")
    public UserDto get(@PathVariable UUID id) {
        return repository.findById(id).map(UserDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @PostMapping
    public UserDto create(
            @Valid @RequestBody CreateUserRequest request,
            @AuthenticationPrincipal AuthenticatedUser caller
    ) {
        requireAdmin(caller);

        if (repository.findByEmail(request.email()).isPresent()) {
            throw new ValidationException("A user with this email already exists");
        }

        Role role = parseRole(request.role());
        Organization org = resolveOrganization(request.organizationId());

        if (role == Role.CLIENT && org == null) {
            throw new ValidationException("CLIENT users must belong to an organization");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setFullName(request.fullName());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(role);
        user.setOrganization(org);
        user.setActive(true);

        return UserDto.from(repository.save(user));
    }

    @PatchMapping("/{id}")
    public UserDto update(
            @PathVariable UUID id,
            @RequestBody UpdateUserRequest request,
            @AuthenticationPrincipal AuthenticatedUser caller
    ) {
        requireAdmin(caller);

        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.fullName() != null && !request.fullName().isBlank()) {
            user.setFullName(request.fullName());
        }

        if (request.role() != null) {
            user.setRole(parseRole(request.role()));
        }

        if (request.organizationId() != null) {
            user.setOrganization(organizationRepository.findById(request.organizationId())
                    .orElseThrow(() -> new ValidationException("Organization not found")));
        }

        if (request.active() != null) {
            if (Boolean.FALSE.equals(request.active()) && user.getId().equals(caller.userId())) {
                throw new ValidationException("You cannot deactivate yourself");
            }
            user.setActive(request.active());
        }

        if (user.getRole() == Role.CLIENT && user.getOrganization() == null) {
            throw new ValidationException("CLIENT users must belong to an organization");
        }

        return UserDto.from(repository.save(user));
    }

    @PostMapping("/{id}/reset-password")
    public ResetPasswordResponse resetPassword(
            @PathVariable UUID id,
            @AuthenticationPrincipal AuthenticatedUser caller
    ) {
        requireAdmin(caller);

        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newPassword = generateTemporaryPassword(12);
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        repository.save(user);

        return new ResetPasswordResponse(newPassword);
    }

    private void requireAdmin(AuthenticatedUser caller) {
        if (!"ADMIN".equals(caller.role())) {
            throw new ValidationException("Only admins can perform this action");
        }
    }

    private Role parseRole(String roleName) {
        try {
            return Role.valueOf(roleName);
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid role: " + roleName);
        }
    }

    private Organization resolveOrganization(UUID orgId) {
        if (orgId == null) return null;
        return organizationRepository.findById(orgId)
                .orElseThrow(() -> new ValidationException("Organization not found"));
    }

    private String generateTemporaryPassword(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(PWD_CHARS.charAt(RANDOM.nextInt(PWD_CHARS.length())));
        }
        return sb.toString();
    }
}
