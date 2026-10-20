package com.vishwakarma.contractor.controller;

import com.vishwakarma.contractor.model.Invoice;
import com.vishwakarma.contractor.repository.InvoiceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;

    public InvoiceController(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @GetMapping
    public List<Invoice> getAllInvoices(@RequestParam(required = false) String status) {
        if (status != null && !status.trim().isEmpty()) {
            return invoiceRepository.findByPaymentStatus(status.toUpperCase());
        }
        return invoiceRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice) {
        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().trim().isEmpty()) {
            invoice.setInvoiceNumber("INV-" + (int)(1000 + Math.random() * 9000));
        }
        Invoice saved = invoiceRepository.save(invoice);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<Invoice> recordPayment(@PathVariable Long id, @RequestBody Map<String, Double> body) {
        Double paymentAmount = body.get("amount");
        if (paymentAmount == null || paymentAmount <= 0) {
            return ResponseEntity.badRequest().build();
        }

        return invoiceRepository.findById(id)
                .map(existing -> {
                    double newPaid = existing.getAmountPaid() + paymentAmount;
                    existing.setAmountPaid(newPaid);
                    if (newPaid >= existing.getTotalAmount()) {
                        existing.setPaymentStatus("PAID");
                    } else {
                        existing.setPaymentStatus("PARTIALLY_PAID");
                    }
                    return ResponseEntity.ok(invoiceRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        if (invoiceRepository.existsById(id)) {
            invoiceRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
