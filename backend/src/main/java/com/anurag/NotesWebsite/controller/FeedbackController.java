package com.anurag.NotesWebsite.controller;

import com.anurag.NotesWebsite.entity.Feedback;
import com.anurag.NotesWebsite.repository.FeedbackRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/feedback")
//@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    // SEND FEEDBACK

    @PostMapping("/send")
    public Feedback sendFeedback(
            @RequestBody Feedback feedback
    ) {

        feedback.setCreatedAt(LocalDateTime.now());

        return feedbackRepository.save(feedback);
    }

    // GET ALL FEEDBACKS

    @GetMapping("/all")
    public List<Feedback> getAllFeedbacks() {

        return feedbackRepository.findAll();
    }
}