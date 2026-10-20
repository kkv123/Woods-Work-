package com.vishwakarma.contractor.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String phone;

    private String emergencyContact;

    @Column(nullable = false)
    private String tradeRole; // e.g. "Master Carpenter", "Veneer Specialist", "Polish Master", "CNC Operator", "Assistant Carpenter"

    @Column(nullable = false)
    private String payType; // "DAILY", "HOURLY", "MONTHLY"

    @Column(nullable = false)
    private Double payRate; // e.g. 1200 (₹1,200/day) or 32000 (₹32,000/mo)

    private String status; // "ACTIVE", "ON_LEAVE", "INACTIVE"

    private String assignedProject; // Current site location / project name

    private Integer experienceYears;

    private LocalDate joinDate;

    public Employee() {
        this.status = "ACTIVE";
        this.joinDate = LocalDate.now();
    }

    public Employee(String fullName, String phone, String emergencyContact, String tradeRole,
                    String payType, Double payRate, String status, String assignedProject, Integer experienceYears) {
        this.fullName = fullName;
        this.phone = phone;
        this.emergencyContact = emergencyContact;
        this.tradeRole = tradeRole;
        this.payType = payType;
        this.payRate = payRate;
        this.status = status != null ? status : "ACTIVE";
        this.assignedProject = assignedProject;
        this.experienceYears = experienceYears;
        this.joinDate = LocalDate.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public String getTradeRole() {
        return tradeRole;
    }

    public void setTradeRole(String tradeRole) {
        this.tradeRole = tradeRole;
    }

    public String getPayType() {
        return payType;
    }

    public void setPayType(String payType) {
        this.payType = payType;
    }

    public Double getPayRate() {
        return payRate;
    }

    public void setPayRate(Double payRate) {
        this.payRate = payRate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAssignedProject() {
        return assignedProject;
    }

    public void setAssignedProject(String assignedProject) {
        this.assignedProject = assignedProject;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public LocalDate getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(LocalDate joinDate) {
        this.joinDate = joinDate;
    }
}
