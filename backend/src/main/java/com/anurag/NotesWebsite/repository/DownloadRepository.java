package com.anurag.NotesWebsite.repository;

import com.anurag.NotesWebsite.entity.Download;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DownloadRepository extends JpaRepository<Download, Long> {

    List<Download> findByUserEmail(String userEmail);

    long countByUserEmail(String email);
}