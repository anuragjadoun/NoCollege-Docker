package com.anurag.NotesWebsite.entity;

import jakarta.persistence.*;

import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // RECEIVER EMAIL
    private String userEmail;

    // NOTIFICATION MESSAGE
    private String message;

    // READ / UNREAD
    @Column(name = "is_read")
    private boolean read = false;

    // CREATED TIME
    private LocalDateTime createdAt;
}