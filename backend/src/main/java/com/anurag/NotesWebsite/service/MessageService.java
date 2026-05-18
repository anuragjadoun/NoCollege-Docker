package com.anurag.NotesWebsite.service;

import com.anurag.NotesWebsite.entity.Message;
import com.anurag.NotesWebsite.repository.MessageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import com.anurag.NotesWebsite.dto.ChatUserDTO;

import com.anurag.NotesWebsite.entity.User;

import com.anurag.NotesWebsite.repository.UserRepository;

import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository
            messageRepository;

    @Autowired
    private UserRepository
            userRepository;

    // SAVE MESSAGE

    public Message saveMessage(

            String senderEmail,

            String receiverEmail,

            String content
    ) {

        Message message =
                new Message();

        message.setSenderEmail(
                senderEmail
        );

        message.setReceiverEmail(
                receiverEmail
        );

        message.setContent(
                content
        );

        message.setTimestamp(
                LocalDateTime.now()
        );

        return messageRepository
                .save(message);
    }

    // GET CHAT

    public List<Message> getChat(

            String user1,

            String user2
    ) {

        return messageRepository
                .findBySenderEmailAndReceiverEmailOrReceiverEmailAndSenderEmailOrderByTimestampAsc(

                        user1,
                        user2,

                        user1,
                        user2
                );
    }

    // RECENT CHATS

// RECENT CHAT USERS

    public List<ChatUserDTO>
    getRecentChats(
            String email
    ) {

        List<String> emails =
                messageRepository
                        .findRecentChats(
                                email
                        );

        List<User> users =
                userRepository
                        .findByEmailIn(
                                emails
                        );

        return users.stream()

                .map(user ->

                        new ChatUserDTO(

                                user.getEmail(),

                                user.getFullName(),

                                user.getProfileImage()
                        )
                )

                .collect(
                        Collectors.toList()
                );
    }

    // UNREAD COUNT

    public long getUnreadCount(
            String email
    ) {

        return messageRepository
                .countByReceiverEmailAndSeenFalse(
                        email
                );
    }

    // MARK CHAT AS SEEN

    public void markMessagesAsSeen(

            String senderEmail,

            String receiverEmail
    ) {

        List<Message> messages =

                messageRepository
                        .findBySenderEmailAndReceiverEmailAndSeenFalse(

                                senderEmail,

                                receiverEmail
                        );

        for (Message message : messages) {

            message.setSeen(true);
        }

        messageRepository.saveAll(
                messages
        );
    }

    // DELETE MESSAGE

    public void deleteMessage(
            Long messageId
    ) {

        messageRepository
                .deleteById(
                        messageId
                );
    }


    // EDIT MESSAGE

    public Message editMessage(

            Long id,

            String content
    ) {

        Message message =

                messageRepository
                        .findById(id)
                        .orElseThrow();

        message.setContent(
                content
        );

        return messageRepository
                .save(message);
    }


    // USER-WISE UNREAD COUNT

    public long getUnreadCountFromUser(

            String senderEmail,

            String receiverEmail
    ) {

        return messageRepository
                .countBySenderEmailAndReceiverEmailAndSeenFalse(

                        senderEmail,

                        receiverEmail
                );
    }
}