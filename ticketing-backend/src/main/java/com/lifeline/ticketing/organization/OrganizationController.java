package com.lifeline.ticketing.organization;

import com.lifeline.ticketing.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class OrganizationController {

    private final OrganizationRepository repository;

    @GetMapping
    public List<OrganizationDto> list() {
        return repository.findAll().stream().map(OrganizationDto::from).toList();
    }

    @GetMapping("/{id}")
    public OrganizationDto get(@PathVariable UUID id) {
        return repository.findById(id)
                .map(OrganizationDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
    }
}