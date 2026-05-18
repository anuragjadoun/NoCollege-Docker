package com.anurag.NotesWebsite.entity;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_reports")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    // WHO REPORTED

    private String reporterEmail;

    // REPORTED USER

    private String reportedUserEmail;

    // REASON

    private String reason;

    // OPTIONAL MESSAGE

    @Column(length = 1000)

    private String message;

    // STATUS

    private String status = "PENDING";

    // CREATED TIME

    private LocalDateTime createdAt =
            LocalDateTime.now();
}