package com.anurag.NotesWebsite.controller;

import com.anurag.NotesWebsite.entity.Rating;
import com.anurag.NotesWebsite.repository.RatingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    // SUBMIT OR UPDATE RATING

    @PostMapping("/rate")
    public Rating submitRating(
            @RequestBody Rating rating
    ) {

        Optional<Rating> existingRating =
                ratingRepository.findByUserEmail(
                        rating.getUserEmail()
                );

        if (existingRating.isPresent()) {

            Rating oldRating =
                    existingRating.get();

            oldRating.setStars(
                    rating.getStars()
            );

            return ratingRepository.save(
                    oldRating
            );
        }

        return ratingRepository.save(rating);
    }

    // GET RATING STATS

    @GetMapping("/stats")
    public Map<String, Object> getRatingStats() {

        List<Rating> ratings =
                ratingRepository.findAll();

        double average = 0;

        if (!ratings.isEmpty()) {

            int totalStars = ratings
                    .stream()
                    .mapToInt(Rating::getStars)
                    .sum();

            average =
                    (double) totalStars
                            / ratings.size();
        }

        Map<String, Object> data =
                new HashMap<>();

        data.put(
                "averageRating",
                Math.round(average * 10.0) / 10.0
        );

        data.put(
                "totalRatings",
                ratings.size()
        );

        return data;
    }
}