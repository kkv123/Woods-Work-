package com.vishwakarma.contractor.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GroqAiService {

    private static final Logger log = LoggerFactory.getLogger(GroqAiService.class);

    private final RestClient restClient;
    private final String groqUrl;
    private final String model;

    // Retain multi-turn conversation context per session
    private final Map<String, List<Map<String, String>>> sessionHistories = new ConcurrentHashMap<>();

    private static final String MILLWORK_PUBLIC_PROMPT = """
        You are "Vishwakarma AI", the expert architectural millwork & quotation consultant for "Vishwakarma Woods Work" (Enterprise Contractor Hub & Digital Quotation Engine).
        
        ABOUT VISHWAKARMA WOODS WORK:
        - We are premier master contractors specializing in architectural woodwork, modular kitchens, custom wardrobes, bespoke furniture, wall paneling, and commercial interior fit-outs.
        - We provide instant, transparent, direct workshop rates with client-side 300-DPI A4 digital quotation rendering, multicompany tax compliance (GST/PAN/SAC 9954), and laser measurement accuracy.
        
        YOUR ROLE & EXPERTISE:
        1. Material Consultation:
           - Plywood Grades:
             * BWP (Boiling Waterproof / IS:710 Marine Grade): Ideal for wet zones like kitchen sinks, bathroom vanities, external areas.
             * BWR (Boiling Water Resistant / IS:303): For kitchen cabinets, laundry zones.
             * MR (Moisture Resistant Commercial): For bedroom wardrobes, TV units, living room consoles.
             * HDHMR (High Density High Moisture Resistance): Outstanding for routed CNC doors and seamless lacquer/PU paint.
           - Surface Finishes:
             * Laminates (1mm High-gloss, Matte, Anti-fingerprint from Merino/Greenlam/Century).
             * Acrylic (High-gloss glass-like reflection for modern kitchens).
             * Natural Wood Veneer (Teak, Walnut, White Oak, Ash) finished with Melamine or Italian PU polish.
             * PU Polish & Deco Paint for luxury seamless panels.
           - Hardware & Fittings:
             * Soft-close hinges, tandem boxes, pantry pull-outs, bi-fold lift-ups (Hettich, Hafele, Blum).
        
        2. Estimation & Quotation Assistance:
           - Explain how rates are calculated per square foot (sq.ft) based on carcass material + shutter finish + hardware grade.
           - Guide prospective clients to use the "Interactive Cost Estimator" right on this page to customize dimensions, finishes, and instantly download a professional 300-DPI A4 PDF quotation.
           - Mention SAC code 9954 (general construction/interior millwork services) and standard 18% GST applicability.
        
        TONE & STYLE:
        - Professional, master craftsman-like, courteous, authoritative, and concise.
        - Encourage visitors to use the "Interactive Cost Estimator" on the page to customize their project and download an instant 300-DPI A4 quotation.

        FORMATTING & UI PRESENTATION RULES:
        - When providing pricing breakdowns, itemizations, or material comparisons, present them using clean Markdown tables with concise column headers.
        - Use bold keywords and clean bullet points for key takeaways.
        - Keep explanations tight, readable, and structured with clear subheadings (###). Avoid excessively long dense walls of text.
        """;

    public GroqAiService(
            @Value("${groq.api.key}") String apiKey,
            @Value("${groq.api.url}") String groqUrl,
            @Value("${groq.api.model}") String model) {

        this.groqUrl = groqUrl;
        this.model = model;
        this.restClient = RestClient.builder()
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public Map<String, String> processChat(String sessionId, String userMessage) {
        String activeSession = (sessionId == null || sessionId.isBlank()) 
                ? UUID.randomUUID().toString() 
                : sessionId;

        List<Map<String, String>> history = sessionHistories.computeIfAbsent(activeSession, k -> new ArrayList<>());

        List<Map<String, String>> requestMessages = new ArrayList<>();
        requestMessages.add(Map.of("role", "system", "content", MILLWORK_PUBLIC_PROMPT));

        synchronized (history) {
            // Include recent conversation turns (up to 8 messages)
            int start = Math.max(0, history.size() - 8);
            for (int i = start; i < history.size(); i++) {
                requestMessages.add(history.get(i));
            }

            // Current question
            Map<String, String> userMsg = Map.of("role", "user", "content", userMessage);
            requestMessages.add(userMsg);

            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "messages", requestMessages,
                    "temperature", 0.65,
                    "max_tokens", 850
            );

            try {
                Map<?, ?> response = restClient.post()
                        .uri(groqUrl)
                        .body(requestBody)
                        .retrieve()
                        .body(Map.class);

                String assistantReply = "I am currently unable to fetch quotation advice. Please try again in a moment.";

                if (response != null && response.containsKey("choices")) {
                    List<?> choices = (List<?>) response.get("choices");
                    if (!choices.isEmpty()) {
                        Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
                        Map<?, ?> msg = (Map<?, ?>) firstChoice.get("message");
                        assistantReply = (String) msg.get("content");
                    }
                }

                history.add(userMsg);
                history.add(Map.of("role", "assistant", "content", assistantReply));

                return Map.of("sessionId", activeSession, "reply", assistantReply);

            } catch (Exception e) {
                log.error("Groq AI API invocation failed: {}", e.getMessage(), e);
                return Map.of(
                        "sessionId", activeSession,
                        "reply", "Hello! I am having a brief network issue connecting to the estimation brain. Please check your connectivity or try again in a moment."
                );
            }
        }
    }
}
