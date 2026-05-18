package com.anurag.NotesWebsite.repository;

import com.anurag.NotesWebsite.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserEmailAndNoteId(String userEmail, Long noteId);

    long countByNoteId(Long noteId);


    @Query("""
    SELECT l.noteId
    FROM Like l
    GROUP BY l.noteId
    ORDER BY COUNT(l.noteId) DESC
""")
    List<Long> findTrendingNoteIds();
}