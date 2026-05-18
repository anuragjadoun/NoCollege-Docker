package com.anurag.NotesWebsite.repository;

import com.anurag.NotesWebsite.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByNoteId(Long noteId);

    List<Comment> findByUserEmail(
            String userEmail
    );
}