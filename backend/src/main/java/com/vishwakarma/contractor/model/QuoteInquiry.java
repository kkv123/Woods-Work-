package com.vishwakarma.contractor.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quote_inquiries")
public class QuoteInquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String quoteReference; // e.g. "VWW-89412"

    @Column(nullable = false)
    private String clientName;

    @Column(nullable = false)
    private String phone;

    private String email;

    @Column(nullable = false)
    private String siteLocation;

    private String serviceTitle; // e.g. "Modular Kitchens & Custom Cabinetry"

    private Integer projectSizeSqFt;

    private String finishTier; // "standard", "premium", "luxury"

    private Double estimatedLow;

    private Double estimatedHigh;

    private String notes;

    private String status; // "NEW", "CONTACTED", "MEASURED", "CONVERTED"

    private LocalDateTime createdAt;

    public QuoteInquiry() {
        this.status = "NEW";
        this.createdAt = LocalDateTime.now();
    }

    public QuoteInquiry(String quoteReference, String clientName, String phone, String email,
                        String siteLocation, String serviceTitle, Integer projectSizeSqFt,
                        String finishTier, Double estimatedLow, Double estimatedHigh, String notes) {
        this.quoteReference = quoteReference;
        this.clientName = clientName;
        this.phone = phone;
        this.email = email;
        this.siteLocation = siteLocation;
        this.serviceTitle = serviceTitle;
        this.projectSizeSqFt = projectSizeSqFt;
        this.finishTier = finishTier;
        this.estimatedLow = estimatedLow;
        this.estimatedHigh = estimatedHigh;
        this.notes = notes;
        this.status = "NEW";
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuoteReference() {
        return quoteReference;
    }

    public void setQuoteReference(String quoteReference) {
        this.quoteReference = quoteReference;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSiteLocation() {
        return siteLocation;
    }

    public void setSiteLocation(String siteLocation) {
        this.siteLocation = siteLocation;
    }

    public String getServiceTitle() {
        return serviceTitle;
    }

    public void setServiceTitle(String serviceTitle) {
        this.serviceTitle = serviceTitle;
    }

    public Integer getProjectSizeSqFt() {
        return projectSizeSqFt;
    }

    public void setProjectSizeSqFt(Integer projectSizeSqFt) {
        this.projectSizeSqFt = projectSizeSqFt;
    }

    public String getFinishTier() {
        return finishTier;
    }

    public void setFinishTier(String finishTier) {
        this.finishTier = finishTier;
    }

    public Double getEstimatedLow() {
        return estimatedLow;
    }

    public void setEstimatedLow(Double estimatedLow) {
        this.estimatedLow = estimatedLow;
    }

    public Double getEstimatedHigh() {
        return estimatedHigh;
    }

    public void setEstimatedHigh(Double estimatedHigh) {
        this.estimatedHigh = estimatedHigh;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
