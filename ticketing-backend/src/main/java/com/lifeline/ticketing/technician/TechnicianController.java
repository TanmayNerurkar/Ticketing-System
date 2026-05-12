package com.lifeline.ticketing.technician;

import com.lifeline.ticketing.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/technicians")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('TECHNICIAN','MANAGER','ADMIN')")
public class TechnicianController {

    private final TechnicianRepository repository;

    @GetMapping
    public List<TechnicianDto> list() {
        return repository.findAll().stream().map(TechnicianDto::from).toList();
    }

    @GetMapping("/{id}/workload")
    public TechnicianDto workload(@PathVariable UUID id) {
        return repository.findById(id).map(TechnicianDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));
    }

    @PatchMapping("/{id}/availability")
    public TechnicianDto setAvailability(
            @PathVariable UUID id,
            @RequestBody AvailabilityRequest req) {
        Technician t = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));
        t.setAvailable(req.available());
        repository.save(t);
        return TechnicianDto.from(t);
    }

    public record AvailabilityRequest(boolean available) {
    }
}