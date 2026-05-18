package com.anurag.NotesWebsite.repository;

import com.anurag.NotesWebsite.entity.Message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;

@Repository
public interface MessageRepository
        extends JpaRepository<Message, Long> {

    // CHAT BETWEEN 2 USERS

    List<Message>
    findBySenderEmailAndReceiverEmailOrReceiverEmailAndSenderEmailOrderByTimestampAsc(

            String sender1,
            String receiver1,

            String receiver2,
            String sender2
    );


    @Query("""

    SELECT DISTINCT

        CASE

            WHEN m.senderEmail = :email

            THEN m.receiverEmail

            ELSE m.senderEmail

        END

    FROM Message m

    WHERE

        m.senderEmail = :email

        OR

        m.receiverEmail = :email

""")
    List<String> findRecentChats(
            @Param("email")
            String email
    );


    long countByReceiverEmailAndSeenFalse(
            String receiverEmail
    );

    List<Message>
    findBySenderEmailAndReceiverEmailAndSeenFalse(

            String senderEmail,

            String receiverEmail
    );


    long countBySenderEmailAndReceiverEmailAndSeenFalse(

            String senderEmail,

            String receiverEmail
    );
}