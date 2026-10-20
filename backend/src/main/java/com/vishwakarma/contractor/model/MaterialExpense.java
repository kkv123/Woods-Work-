package com.vishwakarma.contractor.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "material_expenses")
public class MaterialExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long projectId;

    @Column(nullable = false)
    private String projectTitle;

    @Column(nullable = false)
    private String itemName; // e.g. "Greenply 710 BWP 19mm Marine Ply", "Hettich InnoTech Drawer Channels", "Burma Teak Timber Log"

    @Column(nullable = false)
    private String category; // "Plywood & Boards", "Hardware & Fittings", "Solid Timber", "Veneer & Laminate", "Polish & Finishing"

    private String supplierName; // e.g. "Apex Timber Traders", "Hettich Hardware Depot"

    private Integer quantity;

    private String unit; // "sheets", "sets", "cu ft", "litres"

    @Column(nullable = false)
    private Double totalCost;

    private LocalDate expenseDate;

    public MaterialExpense() {
        this.expenseDate = LocalDate.now();
    }

    public MaterialExpense(Long projectId, String projectTitle, String itemName,
                           String category, String supplierName, Integer quantity,
                           String unit, Double totalCost, LocalDate expenseDate) {
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.itemName = itemName;
        this.category = category;
        this.supplierName = supplierName;
        this.quantity = quantity;
        this.unit = unit;
        this.totalCost = totalCost;
        this.expenseDate = expenseDate != null ? expenseDate : LocalDate.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }

    public LocalDate getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
    }
}
