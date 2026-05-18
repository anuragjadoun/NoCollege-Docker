package com.anurag.NotesWebsite.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private String message;

    private LocalDateTime createdAt;

    private String name;

    private String email;

    private String type;
}