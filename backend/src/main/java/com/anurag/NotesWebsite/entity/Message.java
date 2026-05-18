package com.anurag.NotesWebsite.entity;

import jakarta.persistence.*;

import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Message {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )
    private Long id;

    // SENDER
    private String senderEmail;

    // RECEIVER
    private String receiverEmail;

    // MESSAGE TEXT
    @Column(length = 5000)
    private String content;

    // MESSAGE TIME
    private LocalDateTime timestamp;

    // SEEN STATUS
    private boolean seen = false;
}