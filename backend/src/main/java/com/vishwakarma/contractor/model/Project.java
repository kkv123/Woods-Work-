package com.vishwakarma.contractor.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category; // "Kitchen & Cabinetry", "Bedroom & Storage", "Living & Interior", "Doors & Partitions", "Outdoor & Terraces"

    @Column(nullable = false)
    private String clientName;

    private String clientPhone;

    @Column(nullable = false)
    private String siteLocation;

    @Column(nullable = false)
    private Double budget;

    @Column(nullable = false)
    private String status; // "LEAD", "IN_PROGRESS", "COMPLETED"

    private LocalDate startDate;

    private LocalDate completionDate;

    private String duration; // e.g. "18 Days"

    @Column(length = 1000)
    private String clientReview;

    @Column(length = 1000)
    private String highlights;

    private Boolean isFeaturedPublic;

    public Project() {
        this.status = "IN_PROGRESS";
        this.isFeaturedPublic = false;
        this.startDate = LocalDate.now();
    }

    public Project(String title, String category, String clientName, String clientPhone,
                   String siteLocation, Double budget, String status, LocalDate startDate,
                   LocalDate completionDate, String duration, String clientReview,
                   String highlights, Boolean isFeaturedPublic) {
        this.title = title;
        this.category = category;
        this.clientName = clientName;
        this.clientPhone = clientPhone;
        this.siteLocation = siteLocation;
        this.budget = budget;
        this.status = status != null ? status : "IN_PROGRESS";
        this.startDate = startDate;
        this.completionDate = completionDate;
        this.duration = duration;
        this.clientReview = clientReview;
        this.highlights = highlights;
        this.isFeaturedPublic = isFeaturedPublic != null ? isFeaturedPublic : false;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getClientPhone() {
        return clientPhone;
    }

    public void setClientPhone(String clientPhone) {
        this.clientPhone = clientPhone;
    }

    public String getSiteLocation() {
        return siteLocation;
    }

    public void setSiteLocation(String siteLocation) {
        this.siteLocation = siteLocation;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(LocalDate completionDate) {
        this.completionDate = completionDate;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getClientReview() {
        return clientReview;
    }

    public void setClientReview(String clientReview) {
        this.clientReview = clientReview;
    }

    public String getHighlights() {
        return highlights;
    }

    public void setHighlights(String highlights) {
        this.highlights = highlights;
    }

    public Boolean getIsFeaturedPublic() {
        return isFeaturedPublic;
    }

    public void setIsFeaturedPublic(Boolean isFeaturedPublic) {
        this.isFeaturedPublic = isFeaturedPublic;
    }
}
