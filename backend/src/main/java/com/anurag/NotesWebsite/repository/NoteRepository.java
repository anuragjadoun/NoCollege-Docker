package com.anurag.NotesWebsite.repository;

import com.anurag.NotesWebsite.entity.Note;
import com.anurag.NotesWebsite.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByUser(User user);

    List<Note> findByTitleContainingIgnoreCase(String title);

    List<Note> findByDescriptionContainingIgnoreCase(String description);

    List<Note> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    List<Note> findByUserEmail(String email);

    long countByUser_Email(String email);

    List<Note> findByIdInOrderByCreatedAtDesc(
            List<Long> ids
    );

    List<Note> findTop10ByIdIn(
            List<Long> ids
    );
}