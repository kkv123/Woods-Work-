package com.vishwakarma.contractor.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String invoiceNumber; // e.g. "INV-2026-081"

    private Long projectId;

    @Column(nullable = false)
    private String clientName;

    private String siteLocation;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private Double amountPaid;

    @Column(nullable = false)
    private String paymentStatus; // "PAID", "PARTIALLY_PAID", "DUE"

    private String milestoneStage; // e.g. "30% Advance at Measurement", "50% Carcase Fabrication", "20% Final Handover"

    private LocalDate issueDate;

    private LocalDate dueDate;

    public Invoice() {
        this.issueDate = LocalDate.now();
        this.paymentStatus = "DUE";
        this.amountPaid = 0.0;
    }

    public Invoice(String invoiceNumber, Long projectId, String clientName, String siteLocation,
                   Double totalAmount, Double amountPaid, String paymentStatus,
                   String milestoneStage, LocalDate issueDate, LocalDate dueDate) {
        this.invoiceNumber = invoiceNumber;
        this.projectId = projectId;
        this.clientName = clientName;
        this.siteLocation = siteLocation;
        this.totalAmount = totalAmount;
        this.amountPaid = amountPaid;
        this.paymentStatus = paymentStatus;
        this.milestoneStage = milestoneStage;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getSiteLocation() {
        return siteLocation;
    }

    public void setSiteLocation(String siteLocation) {
        this.siteLocation = siteLocation;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Double getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(Double amountPaid) {
        this.amountPaid = amountPaid;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getMilestoneStage() {
        return milestoneStage;
    }

    public void setMilestoneStage(String milestoneStage) {
        this.milestoneStage = milestoneStage;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}
