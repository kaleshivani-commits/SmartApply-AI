package com.smartapply.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smartapply.entity.JobApplication;

@Repository
public interface JobApplicationRepository
                extends JpaRepository<JobApplication, Long> {

}
