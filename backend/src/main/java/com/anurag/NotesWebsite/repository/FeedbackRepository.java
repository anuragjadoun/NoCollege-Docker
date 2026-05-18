package com.anurag.NotesWebsite.repository;

import com.anurag.NotesWebsite.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}