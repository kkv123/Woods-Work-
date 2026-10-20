package com.vishwakarma.contractor.controller;

import com.vishwakarma.contractor.model.MaterialExpense;
import com.vishwakarma.contractor.repository.MaterialExpenseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final MaterialExpenseRepository materialExpenseRepository;

    public ExpenseController(MaterialExpenseRepository materialExpenseRepository) {
        this.materialExpenseRepository = materialExpenseRepository;
    }

    @GetMapping
    public List<MaterialExpense> getAllExpenses(@RequestParam(required = false) Long projectId,
                                                @RequestParam(required = false) String category) {
        if (projectId != null) {
            return materialExpenseRepository.findByProjectId(projectId);
        }
        if (category != null && !category.trim().isEmpty()) {
            return materialExpenseRepository.findByCategory(category);
        }
        return materialExpenseRepository.findAll();
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getExpenseSummary() {
        List<MaterialExpense> all = materialExpenseRepository.findAll();
        double totalExpense = all.stream().mapToDouble(MaterialExpense::getTotalCost).sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalExpense", totalExpense);
        summary.put("totalPurchases", all.size());
        return ResponseEntity.ok(summary);
    }

    @PostMapping
    public ResponseEntity<MaterialExpense> addExpense(@RequestBody MaterialExpense expense) {
        MaterialExpense saved = materialExpenseRepository.save(expense);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        if (materialExpenseRepository.existsById(id)) {
            materialExpenseRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
