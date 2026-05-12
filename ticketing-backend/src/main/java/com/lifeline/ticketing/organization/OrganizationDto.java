package com.lifeline.ticketing.organization;

import java.util.UUID;

public record OrganizationDto(
        UUID id,
        String name,
        String type,
        String region,
        String contactEmail,
        String slaTier
) {
    public static OrganizationDto from(Organization o) {
        return new OrganizationDto(
                o.getId(),
                o.getName(),
                o.getType().name(),
                o.getRegion(),
                o.getContactEmail(),
                o.getSlaTier().name()
        );
    }
}