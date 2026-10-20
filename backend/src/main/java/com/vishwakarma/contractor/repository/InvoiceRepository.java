package com.vishwakarma.contractor.repository;

import com.vishwakarma.contractor.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByPaymentStatus(String paymentStatus);
    List<Invoice> findByProjectId(Long projectId);
}
