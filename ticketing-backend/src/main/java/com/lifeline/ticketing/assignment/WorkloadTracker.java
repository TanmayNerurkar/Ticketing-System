package com.lifeline.ticketing.assignment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class WorkloadTracker {

    private static final String KEY_PREFIX = "techs:";
    private final StringRedisTemplate redis;

    public void register(String skill, UUID technicianId, int currentLoad) {
        redis.opsForZSet().add(keyFor(skill), technicianId.toString(), currentLoad);
    }

    public Optional<UUID> findLeastLoaded(String skill) {
        Set<String> result = redis.opsForZSet().range(keyFor(skill), 0, 0);
        if (result == null || result.isEmpty()) return Optional.empty();
        try {
            return Optional.of(UUID.fromString(result.iterator().next()));
        } catch (IllegalArgumentException e) {
            log.warn("Invalid UUID in workload set for skill {}", skill);
            return Optional.empty();
        }
    }

    public void incrementLoad(String skill, UUID technicianId, int delta) {
        redis.opsForZSet().incrementScore(keyFor(skill), technicianId.toString(), delta);
    }

    public long countTechnicians(String skill) {
        Long size = redis.opsForZSet().zCard(keyFor(skill));
        return size == null ? 0L : size;
    }

    public void clear(String skill) {
        redis.delete(keyFor(skill));
    }

    private String keyFor(String skill) {
        return KEY_PREFIX + skill;
    }
}