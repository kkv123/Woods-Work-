package com.vishwakarma.contractor.controller;

import com.vishwakarma.contractor.model.QuoteInquiry;
import com.vishwakarma.contractor.repository.QuoteInquiryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {

    private final QuoteInquiryRepository quoteInquiryRepository;

    public QuoteController(QuoteInquiryRepository quoteInquiryRepository) {
        this.quoteInquiryRepository = quoteInquiryRepository;
    }

    @GetMapping
    public List<QuoteInquiry> getAllQuotes(@RequestParam(required = false) String status) {
        if (status != null && !status.trim().isEmpty()) {
            return quoteInquiryRepository.findByStatus(status.toUpperCase());
        }
        return quoteInquiryRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<QuoteInquiry> submitQuoteInquiry(@RequestBody QuoteInquiry quoteInquiry) {
        if (quoteInquiry.getQuoteReference() == null || quoteInquiry.getQuoteReference().trim().isEmpty()) {
            quoteInquiry.setQuoteReference("VWW-" + (int)(10000 + Math.random() * 90000));
        }
        QuoteInquiry saved = quoteInquiryRepository.save(quoteInquiry);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<QuoteInquiry> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        return quoteInquiryRepository.findById(id)
                .map(existing -> {
                    if (newStatus != null) {
                        existing.setStatus(newStatus.toUpperCase());
                    }
                    return ResponseEntity.ok(quoteInquiryRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
