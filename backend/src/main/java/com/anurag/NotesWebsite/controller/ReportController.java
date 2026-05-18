package com.anurag.NotesWebsite.controller;

import com.anurag.NotesWebsite.entity.User;
import com.anurag.NotesWebsite.entity.UserReport;

import com.anurag.NotesWebsite.repository.UserReportRepository;
import com.anurag.NotesWebsite.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import com.anurag.NotesWebsite.entity.Note;

import com.anurag.NotesWebsite.repository.NoteRepository;

//import java.util.List;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;

@RestController

@RequestMapping("/api/report")

public class ReportController {

    @Autowired
    private UserReportRepository userReportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NoteRepository noteRepository;


    private final RestTemplate restTemplate =
            new RestTemplate();

    // CREATE REPORT

    @PostMapping("/user")

    public UserReport reportUser(

            @RequestBody UserReport report
    ) {

        report.setCreatedAt(
                LocalDateTime.now()
        );

        report.setStatus(
                "PENDING"
        );

        return userReportRepository.save(report);
    }

    // GET ALL REPORTS

    @GetMapping("/all")

    public List<UserReport> getAllReports() {

        return userReportRepository.findAll();
    }

    // DELETE REPORT

    @DeleteMapping("/{id}")

    public String deleteReport(

            @PathVariable Long id
    ) {

        userReportRepository.deleteById(id);

        return "Report removed ✅";
    }

    // TEMP BAN USER

    @PostMapping("/temp-ban/{email}")

    public String tempBanUser(

            @PathVariable String email
    ) {

        User user =

                userRepository
                        .findByEmail(email)
                        .orElseThrow();

        user.setBanned(true);

        user.setBanExpiry(

                LocalDateTime.now()
                        .plusDays(30)
        );

        userRepository.save(user);

        // SEND EMAIL

        Map<String, String> emailRequest =
                new HashMap<>();

        emailRequest.put(
                "to",
                user.getEmail()
        );

        emailRequest.put(
                "subject",
                "Temporary Ban Notice"
        );

        emailRequest.put(
                "message",

                "Your account has been temporarily banned for 30 days due to violation of community guidelines."
        );

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );

        HttpEntity<Map<String, String>> entity =
                new HttpEntity<>(
                        emailRequest,
                        headers
                );

        restTemplate.postForObject(

                "https://nocollege-docker-1.onrender.com/email/send",

                entity,

                String.class
        );

        return "User temporarily banned ✅";
    }


    @DeleteMapping("/permanent-delete/{email}")

    public ResponseEntity<?> permanentlyDeleteUser(

            @PathVariable String email
    ) {

        try {

            User user =

                    userRepository
                            .findByEmail(email)
                            .orElse(null);

            // USER NOT FOUND

            if (user == null) {

                return ResponseEntity
                        .badRequest()
                        .body("User not found ❌");
            }

            // DELETE USER NOTES

            List<Note> notes =

                    noteRepository.findByUser(user);

            noteRepository.deleteAll(notes);

            // DELETE USER REPORTS

            List<UserReport> reports =

                    userReportRepository.findAll();

            for (UserReport report : reports) {

                if (

                        report.getReportedUserEmail()
                                .equals(email)

                                ||

                                report.getReporterEmail()
                                        .equals(email)
                ) {

                    userReportRepository.delete(report);
                }
            }

            // SEND DELETE EMAIL

            Map<String, String> emailRequest =
                    new HashMap<>();

            emailRequest.put(
                    "to",
                    user.getEmail()
            );

            emailRequest.put(
                    "subject",
                    "Account Permanently Deleted"
            );

            emailRequest.put(
                    "message",

                    "Your account has been permanently removed due to repeated violations and malicious activity on the platform."
            );

            HttpHeaders headers =
                    new HttpHeaders();

            headers.setContentType(
                    MediaType.APPLICATION_JSON
            );

            HttpEntity<Map<String, String>> entity =
                    new HttpEntity<>(
                            emailRequest,
                            headers
                    );

            restTemplate.postForObject(

                    "https://nocollege-docker-1.onrender.com/email/send",

                    entity,

                    String.class
            );

            // DELETE USER

            userRepository.delete(user);

            return ResponseEntity.ok(
                    "User permanently deleted 💀"
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to delete user ❌");
        }
    }
}