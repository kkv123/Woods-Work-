package com.vishwakarma.contractor.controller;

import com.vishwakarma.contractor.model.Employee;
import com.vishwakarma.contractor.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public List<Employee> getAllEmployees(@RequestParam(required = false) String status,
                                          @RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return employeeRepository.findByFullNameContainingIgnoreCase(search);
        }
        if (status != null && !status.trim().isEmpty()) {
            return employeeRepository.findByStatus(status.toUpperCase());
        }
        return employeeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return employeeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        Employee saved = employeeRepository.save(employee);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee updated) {
        return employeeRepository.findById(id)
                .map(existing -> {
                    existing.setFullName(updated.getFullName());
                    existing.setPhone(updated.getPhone());
                    existing.setEmergencyContact(updated.getEmergencyContact());
                    existing.setTradeRole(updated.getTradeRole());
                    existing.setPayType(updated.getPayType());
                    existing.setPayRate(updated.getPayRate());
                    existing.setStatus(updated.getStatus());
                    existing.setAssignedProject(updated.getAssignedProject());
                    existing.setExperienceYears(updated.getExperienceYears());
                    return ResponseEntity.ok(employeeRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
