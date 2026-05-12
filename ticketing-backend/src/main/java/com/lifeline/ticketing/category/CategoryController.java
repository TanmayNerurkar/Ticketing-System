package com.lifeline.ticketing.category;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository repository;

    @GetMapping
    @Cacheable("categories")
    public List<CategoryDto> list() {
        return repository.findByActiveTrueOrderBySortOrderAsc().stream()
                .map(CategoryDto::from)
                .toList();
    }
}