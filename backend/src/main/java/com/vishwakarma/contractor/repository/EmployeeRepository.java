package com.vishwakarma.contractor.repository;

import com.vishwakarma.contractor.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByStatus(String status);
    List<Employee> findByTradeRoleContainingIgnoreCase(String tradeRole);
    List<Employee> findByFullNameContainingIgnoreCase(String name);
}
