package com.vishwakarma.contractor.controller;

import com.vishwakarma.contractor.model.Project;
import com.vishwakarma.contractor.repository.ProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public List<Project> getAllProjects(@RequestParam(required = false) String status) {
        if (status != null && !status.trim().isEmpty()) {
            return projectRepository.findByStatus(status.toUpperCase());
        }
        return projectRepository.findAll();
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getProjectsSummary() {
        List<Project> all = projectRepository.findAll();
        long completed = all.stream().filter(p -> "COMPLETED".equalsIgnoreCase(p.getStatus())).count();
        long inProgress = all.stream().filter(p -> "IN_PROGRESS".equalsIgnoreCase(p.getStatus())).count();
        double totalBudget = all.stream().mapToDouble(Project::getBudget).sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalProjects", all.size());
        summary.put("completedProjects", completed);
        summary.put("inProgressProjects", inProgress);
        summary.put("totalPipelineBudget", totalBudget);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project saved = projectRepository.save(project);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project updated) {
        return projectRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updated.getTitle());
                    existing.setCategory(updated.getCategory());
                    existing.setClientName(updated.getClientName());
                    existing.setClientPhone(updated.getClientPhone());
                    existing.setSiteLocation(updated.getSiteLocation());
                    existing.setBudget(updated.getBudget());
                    existing.setStatus(updated.getStatus());
                    existing.setDuration(updated.getDuration());
                    existing.setHighlights(updated.getHighlights());
                    existing.setClientReview(updated.getClientReview());
                    existing.setIsFeaturedPublic(updated.getIsFeaturedPublic());
                    return ResponseEntity.ok(projectRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Project> markAsCompleted(@PathVariable Long id,
                                                   @RequestBody(required = false) Map<String, String> body) {
        return projectRepository.findById(id)
                .map(existing -> {
                    existing.setStatus("COMPLETED");
                    existing.setCompletionDate(LocalDate.now());
                    if (body != null && body.containsKey("clientReview")) {
                        existing.setClientReview(body.get("clientReview"));
                    }
                    if (body != null && body.containsKey("isFeaturedPublic")) {
                        existing.setIsFeaturedPublic(Boolean.parseBoolean(body.get("isFeaturedPublic")));
                    }
                    return ResponseEntity.ok(projectRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
