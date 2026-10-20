package com.vishwakarma.contractor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ContractorApplication {

    public static void main(String[] args) {
        SpringApplication.run(ContractorApplication.class, args);
        System.out.println("==========================================================");
        System.out.println(" Vishwakarma Woods Work - Backend API Started on port 8080");
        System.out.println(" REST Endpoints: /api/employees | /api/projects | /api/quotes");
        System.out.println(" Keep-alive Health Endpoint: /api/health");
        System.out.println(" H2 Console: http://localhost:8080/h2-console");
        System.out.println("==========================================================");
    }
}
