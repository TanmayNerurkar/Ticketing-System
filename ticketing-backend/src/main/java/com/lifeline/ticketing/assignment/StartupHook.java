package com.lifeline.ticketing.assignment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class StartupHook {

    private final AssignmentService assignmentService;

    @EventListener(ApplicationReadyEvent.class)
    public void warmUp() {
        log.info("Application ready: warming up assignment tracking");
        try {
            assignmentService.warmUpAllSkills();
        } catch (Exception e) {
            log.error("Warm-up failed (non-fatal)", e);
        }
    }
}