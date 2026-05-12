package com.lifeline.ticketing.user;

import com.lifeline.ticketing.common.exception.ResourceNotFoundException;
import com.lifeline.ticketing.common.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository repository;

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
}