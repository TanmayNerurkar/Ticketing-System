package com.lifeline.ticketing.technician;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TechnicianRepository extends JpaRepository<Technician, UUID> {

    @Query(value = """
            SELECT t.* FROM technicians t
            WHERE t.is_available = true
              AND :skill = ANY(t.skills)
              AND t.active_ticket_count < t.max_concurrent
            ORDER BY t.active_ticket_count ASC
            """, nativeQuery = true)
    List<Technician> findAvailableBySkill(@Param("skill") String skill);

    @Query(value = "SELECT t.* FROM technicians t WHERE t.is_available = true", nativeQuery = true)
    List<Technician> findAllAvailable();
}