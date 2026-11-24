package com.vishwakarma.contractor.controller;

import com.vishwakarma.contractor.service.GroqAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public/ai")
@CrossOrigin(origins = "*")
public class PublicAiController {

    private final GroqAiService groqAiService;

    public PublicAiController(GroqAiService groqAiService) {
        this.groqAiService = groqAiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("reply", "Message cannot be empty."));
        }
        String sessionId = request.get("sessionId");
        Map<String, String> response = groqAiService.processChat(sessionId, message);
        return ResponseEntity.ok(response);
    }
}
