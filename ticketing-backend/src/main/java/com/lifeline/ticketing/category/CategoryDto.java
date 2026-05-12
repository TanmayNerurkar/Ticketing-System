package com.lifeline.ticketing.category;

import java.util.List;
import java.util.UUID;

public record CategoryDto(
        UUID id,
        String name,
        List<String> subcategories,
        String requiredSkill
) {
    public static CategoryDto from(Category c) {
        return new CategoryDto(c.getId(), c.getName(), c.getSubcategories(), c.getRequiredSkill());
    }
}