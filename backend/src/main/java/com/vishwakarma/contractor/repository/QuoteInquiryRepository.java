package com.vishwakarma.contractor.repository;

import com.vishwakarma.contractor.model.QuoteInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuoteInquiryRepository extends JpaRepository<QuoteInquiry, Long> {
    Optional<QuoteInquiry> findByQuoteReference(String quoteReference);
    List<QuoteInquiry> findByStatus(String status);
}
