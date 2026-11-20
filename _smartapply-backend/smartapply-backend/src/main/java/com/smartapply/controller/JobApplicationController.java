
package com.smartapply.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.smartapply.entity.JobApplication;
import com.smartapply.service.JobApplicationService;
import java.util.Optional;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }

    // API to save a job application
    @PostMapping
    public ResponseEntity<JobApplication> saveApplication(
            @RequestBody JobApplication application) {

        JobApplication savedApplication = service.saveApplication(application);

        return new ResponseEntity<>(
                savedApplication, HttpStatus.CREATED);
    }

    // API to get all job applications
    @GetMapping
    public ResponseEntity<List<JobApplication>> getAllApplications() {

        List<JobApplication> applications = service.getAllApplications();

        return ResponseEntity.ok(applications);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplication> updateApplication(
            @PathVariable Long id,
            @RequestBody JobApplication application) {

        Optional<JobApplication> updated = service.updateApplication(id, application);

        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id) {

        boolean deleted = service.deleteApplication(id);

        if (deleted) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

}
