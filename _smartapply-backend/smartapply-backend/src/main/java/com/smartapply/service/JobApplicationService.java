
package com.smartapply.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.smartapply.entity.JobApplication;
import com.smartapply.repository.JobApplicationRepository;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    // Save a job application
    public JobApplication saveApplication(JobApplication application) {

        if (application.getAppliedDate() == null) {
            application.setAppliedDate(LocalDate.now());
        }

        if (application.getStatus() == null ||
                application.getStatus().isBlank()) {
            application.setStatus("APPLIED");
        }

        return repository.save(application);
    }

    // Get all job applications
    public List<JobApplication> getAllApplications() {
        return repository.findAll();
    }
    public Optional<JobApplication> updateApplication(
            Long id, JobApplication updatedApplication) {

        return repository.findById(id).map(existingApplication -> {

            existingApplication.setCompanyName(
                    updatedApplication.getCompanyName());

            existingApplication.setJobTitle(
                    updatedApplication.getJobTitle());

            existingApplication.setLocation(
                    updatedApplication.getLocation());

            existingApplication.setStatus(
                    updatedApplication.getStatus());

            existingApplication.setAppliedDate(
                    updatedApplication.getAppliedDate());

            existingApplication.setJobDescription(
                    updatedApplication.getJobDescription());

            existingApplication.setNotes(
                    updatedApplication.getNotes());

            return repository.save(existingApplication);
        });
    }

    public boolean deleteApplication(Long id) {

        if (!repository.existsById(id)) {
            return false;
        }

        repository.deleteById(id);
        return true;
    }
}


