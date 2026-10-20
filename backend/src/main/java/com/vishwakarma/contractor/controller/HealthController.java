package com.vishwakarma.contractor.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final LocalDateTime startedAt = LocalDateTime.now();

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "Vishwakarma Woods Work - Backend API");
        status.put("startedAt", startedAt);
        status.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(status);
    }
}
