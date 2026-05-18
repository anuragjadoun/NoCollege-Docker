package com.anurag.NotesWebsite.repository;

import com.anurag.NotesWebsite.entity.UserReport;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserReportRepository
        extends JpaRepository<UserReport, Long> {
}