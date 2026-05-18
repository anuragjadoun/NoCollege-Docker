package com.anurag.NotesWebsite.repository;

import com.anurag.NotesWebsite.entity.Bookmark;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository
        extends JpaRepository<Bookmark, Long> {

    // CHECK ALREADY BOOKMARKED
    Optional<Bookmark>
    findByUserEmailAndNoteId(
            String userEmail,
            Long noteId
    );

    // GET USER BOOKMARKS
    List<Bookmark>
    findByUserEmailOrderByCreatedAtDesc(
            String userEmail
    );
}