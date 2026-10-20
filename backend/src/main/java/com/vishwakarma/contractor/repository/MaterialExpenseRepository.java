package com.vishwakarma.contractor.repository;

import com.vishwakarma.contractor.model.MaterialExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialExpenseRepository extends JpaRepository<MaterialExpense, Long> {
    List<MaterialExpense> findByProjectId(Long projectId);
    List<MaterialExpense> findByCategory(String category);
}
