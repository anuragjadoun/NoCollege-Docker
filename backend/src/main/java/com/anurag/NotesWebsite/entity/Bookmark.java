package com.anurag.NotesWebsite.entity;

import jakarta.persistence.*;

import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // USER EMAIL
    private String userEmail;

    // NOTE ID
    private Long noteId;

    // TIME
    private LocalDateTime createdAt;
}