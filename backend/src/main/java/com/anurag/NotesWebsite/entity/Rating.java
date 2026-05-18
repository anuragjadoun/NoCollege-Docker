package com.anurag.NotesWebsite.entity;

import jakarta.persistence.*;

import lombok.Data;

@Entity
@Data
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // USER EMAIL

    @Column(unique = true)
    private String userEmail;

    // RATING VALUE

    private int stars;
}