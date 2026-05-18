package com.anurag.NotesWebsite.repository;

import com.anurag.NotesWebsite.entity.Rating;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RatingRepository
        extends JpaRepository<Rating, Long> {

    // FIND USER RATING

    Optional<Rating> findByUserEmail(
            String userEmail
    );
}