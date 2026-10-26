package com.vishwakarma.contractor.config;

import com.vishwakarma.contractor.model.Employee;
import com.vishwakarma.contractor.model.Project;
import com.vishwakarma.contractor.model.QuoteInquiry;
import com.vishwakarma.contractor.model.Invoice;
import com.vishwakarma.contractor.model.MaterialExpense;
import com.vishwakarma.contractor.model.AppUser;
import com.vishwakarma.contractor.repository.EmployeeRepository;
import com.vishwakarma.contractor.repository.ProjectRepository;
import com.vishwakarma.contractor.repository.QuoteInquiryRepository;
import com.vishwakarma.contractor.repository.InvoiceRepository;
import com.vishwakarma.contractor.repository.MaterialExpenseRepository;
import com.vishwakarma.contractor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Value("${INITIAL_ADMIN_PASSWORD:Admin@Secure2026}")
    private String initialAdminPassword;

    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final QuoteInquiryRepository quoteInquiryRepository;
    private final InvoiceRepository invoiceRepository;
    private final MaterialExpenseRepository materialExpenseRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(EmployeeRepository employeeRepository,
                           ProjectRepository projectRepository,
                           QuoteInquiryRepository quoteInquiryRepository,
                           InvoiceRepository invoiceRepository,
                           MaterialExpenseRepository materialExpenseRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
        this.quoteInquiryRepository = quoteInquiryRepository;
        this.invoiceRepository = invoiceRepository;
        this.materialExpenseRepository = materialExpenseRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed & Ensure Enterprise Admin & Demo Accounts (BCrypt salted hash in Supabase Postgres)
        seedUserIfMissing("contractor@vishwakarmawoods.com", initialAdminPassword, "Kuldeep Vishwakarma (Contractor Owner)", "ROLE_ADMIN");
        seedUserIfMissing("admin", initialAdminPassword, "Master Woodcraft Admin", "ROLE_ADMIN");
        seedUserIfMissing("demo", "Demo@2026", "Hiring Team / Recruiter Demo", "ROLE_ADMIN");

        if (employeeRepository.count() == 0) {
            employeeRepository.save(new Employee(
                    "Ramesh Sharma", "+91 98210 44101", "+91 98210 99991",
                    "Lead Master Carpenter", "DAILY", 1400.0, "ACTIVE",
                    "Greenwood Palms Villa", 18
            ));

            employeeRepository.save(new Employee(
                    "Suresh Mistry", "+91 98210 55202", "+91 98210 99992",
                    "Modular Kitchen Specialist", "DAILY", 1250.0, "ACTIVE",
                    "Greenwood Palms Villa", 12
            ));

            employeeRepository.save(new Employee(
                    "Dilip Prajapati", "+91 98210 66303", "+91 98210 99993",
                    "Italian PU & Veneer Polish Master", "DAILY", 1100.0, "ACTIVE",
                    "Silver Oak Towers", 10
            ));

            employeeRepository.save(new Employee(
                    "Anil Verma", "+91 98210 77404", "+91 98210 99994",
                    "CNC & Beam Saw Operator", "MONTHLY", 34000.0, "ACTIVE",
                    "Main Workshop (Plot 42)", 8
            ));

            employeeRepository.save(new Employee(
                    "Mohan Lal", "+91 98210 88505", "+91 98210 99995",
                    "Heavy Teak Door Artisan", "DAILY", 1500.0, "ACTIVE",
                    "Lakeview Enclave", 22
            ));

            employeeRepository.save(new Employee(
                    "Vikas Kumar", "+91 98210 11606", "+91 98210 99996",
                    "Assistant Joiner / Fitter", "DAILY", 750.0, "ACTIVE",
                    "Greenwood Palms Villa", 3
            ));

            employeeRepository.save(new Employee(
                    "Rajesh Yadav", "+91 98210 22707", "+91 98210 99997",
                    "Site Assembly Carpenter", "DAILY", 950.0, "ACTIVE",
                    "Prestige Boulevard", 5
            ));

            employeeRepository.save(new Employee(
                    "Pawan Singh", "+91 98210 33808", "+91 98210 99998",
                    "Wardrobe Track & Louver Specialist", "DAILY", 1150.0, "ACTIVE",
                    "Silver Oak Towers", 7
            ));

            System.out.println(">>> Initialized 8 realistic employee records.");
        }

        if (projectRepository.count() == 0) {
            projectRepository.save(new Project(
                    "Luxury Acrylic Modular Kitchen & Island", "Kitchen & Cabinetry",
                    "Rajesh & Meera Sharma", "+91 98450 12345", "Greenwood Palms, Villa 14",
                    210000.0, "COMPLETED", LocalDate.now().minusDays(25), LocalDate.now().minusDays(7),
                    "18 Days", "Flawless finish and zero-gap alignment. Best team!",
                    "100% BWP Marine 710 ply, Hettich tandem boxes, handleless J-profile", true
            ));

            projectRepository.save(new Project(
                    "Full-Height Master Bedroom Wardrobe", "Bedroom & Storage",
                    "Dr. Ananya Verma", "+91 98450 23456", "Silver Oak Towers, Flat 9B",
                    145000.0, "COMPLETED", LocalDate.now().minusDays(30), LocalDate.now().minusDays(18),
                    "12 Days", "Master carpenters! Worked clean and on schedule.",
                    "Floor to ceiling sliding doors, sensor LED profiles, walnut veneer", true
            ));

            projectRepository.save(new Project(
                    "Architectural Teak TV Media Console", "Living & Interior",
                    "Siddharth & Priya Nair", "+91 98450 34567", "Prestige Boulevard",
                    92000.0, "IN_PROGRESS", LocalDate.now().minusDays(6), null,
                    "8 Days Est.", null,
                    "Teak fluted batten paneling, concealed wire raceways, floating ledge", true
            ));

            projectRepository.save(new Project(
                    "Hand-Carved Teak Main Entrance Door", "Doors & Partitions",
                    "Rameshwar Patel", "+91 98450 45678", "Lakeview Enclave, House 8",
                    68000.0, "IN_PROGRESS", LocalDate.now().minusDays(4), null,
                    "14 Days Est.", null,
                    "Seasoned CP Teak with CNC geometric carving, heavy chowkhat frame", false
            ));

            projectRepository.save(new Project(
                    "Terrace Wooden Decking & Pergola", "Outdoor & Terraces",
                    "Vikram Malhotra", "+91 98450 56789", "Highland Heights Penthouse",
                    180000.0, "IN_PROGRESS", LocalDate.now().minusDays(2), null,
                    "10 Days Est.", null,
                    "Weather-treated hardwood decking with hidden clips, timber pergola", false
            ));

            System.out.println(">>> Initialized 5 active/completed project records.");
        }

        if (quoteInquiryRepository.count() == 0) {
            quoteInquiryRepository.save(new QuoteInquiry(
                    "VWW-71829", "Alok Sengupta", "+91 98111 22334", "alok.s@gmail.com",
                    "Emerald Court, Tower 3", "Modular Kitchens & Custom Cabinetry",
                    320, "premium", 85000.0, 115000.0,
                    "Need acrylic finish with quartz countertop setup."
            ));
            quoteInquiryRepository.save(new QuoteInquiry(
                    "VWW-45210", "Meenakshi Sundaram", "+91 98222 33445", "meenakshi@outlook.com",
                    "Prestige Ferns, Apt 402", "Designer Wardrobes & Walk-In Closets",
                    180, "luxury", 220000.0, 260000.0,
                    "Fluted glass sliding wardrobe with tinted profile doors."
            ));
            System.out.println(">>> Initialized sample quote inquiries.");
        }

        if (invoiceRepository.count() == 0) {
            invoiceRepository.save(new Invoice(
                    "INV-2026-001", 1L, "Rajesh & Meera Sharma", "Greenwood Palms, Villa 14",
                    210000.0, 210000.0, "PAID", "100% Final Payment Handover",
                    LocalDate.now().minusDays(7), LocalDate.now().minusDays(7)
            ));

            invoiceRepository.save(new Invoice(
                    "INV-2026-002", 3L, "Siddharth & Priya Nair", "Prestige Boulevard",
                    92000.0, 46000.0, "PARTIALLY_PAID", "50% Carcase Fabrication Advance",
                    LocalDate.now().minusDays(5), LocalDate.now().plusDays(5)
            ));

            invoiceRepository.save(new Invoice(
                    "INV-2026-003", 5L, "Vikram Malhotra", "Highland Heights Penthouse",
                    180000.0, 60000.0, "PARTIALLY_PAID", "30% Site Measurement & Timber Advance",
                    LocalDate.now().minusDays(2), LocalDate.now().plusDays(8)
            ));
            System.out.println(">>> Initialized sample milestone invoices.");
        }

        if (materialExpenseRepository.count() == 0) {
            materialExpenseRepository.save(new MaterialExpense(
                    3L, "Architectural Teak TV Media Console", "100% Calibrated BWP 710 19mm Marine Ply",
                    "Plywood & Boards", "Greenply Depot", 12, "sheets", 32400.0, LocalDate.now().minusDays(5)
            ));

            materialExpenseRepository.save(new MaterialExpense(
                    3L, "Architectural Teak TV Media Console", "Natural Burma Teak Fluted Louvers",
                    "Solid Timber", "Timber Market Yard", 35, "sq ft", 18500.0, LocalDate.now().minusDays(4)
            ));

            materialExpenseRepository.save(new MaterialExpense(
                    1L, "Luxury Acrylic Modular Kitchen & Island", "Hettich InnoTech Tandem Drawer Channels & Hinges",
                    "Hardware & Fittings", "Hettich Brand Outlet", 8, "sets", 26800.0, LocalDate.now().minusDays(18)
            ));

            materialExpenseRepository.save(new MaterialExpense(
                    1L, "Luxury Acrylic Modular Kitchen & Island", "Italian PU Clear Matte Protective Polish",
                    "Polish & Finishing", "Asian Paints Woodtech", 10, "litres", 9500.0, LocalDate.now().minusDays(10)
            ));
            System.out.println(">>> Initialized sample material expenses.");
        }
    }

    private void seedUserIfMissing(String username, String plainPassword, String fullName, String role) {
        userRepository.findByUsername(username).ifPresentOrElse(
                existing -> {
                    // Update password to ensure it matches the current environment configuration
                    existing.setPassword(passwordEncoder.encode(plainPassword));
                    existing.setFullName(fullName);
                    userRepository.save(existing);
                },
                () -> {
                    userRepository.save(new AppUser(
                            username,
                            passwordEncoder.encode(plainPassword),
                            fullName,
                            role
                    ));
                    System.out.println(">>> Created user account: " + username);
                }
        );
    }
}
