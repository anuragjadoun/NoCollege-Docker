package com.anurag.NotesWebsite.controller;

import com.anurag.NotesWebsite.entity.Message;

import com.anurag.NotesWebsite.service.MessageService;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.messaging.handler.annotation.MessageMapping;

import org.springframework.messaging.handler.annotation.Payload;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.anurag.NotesWebsite.dto.ChatUserDTO;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate
            messagingTemplate;

    // REAL-TIME SEND MESSAGE

    @MessageMapping("/sendMessage")
    public void sendMessage(

            @Payload Message message
    ) {

        Message savedMessage =

                messageService.saveMessage(

                        message.getSenderEmail(),

                        message.getReceiverEmail(),

                        message.getContent()
                );

        // RECEIVER

        messagingTemplate.convertAndSend(

                "/topic/messages/" +
                        message.getReceiverEmail(),

                savedMessage
        );

        // SENDER

        messagingTemplate.convertAndSend(

                "/topic/messages/" +
                        message.getSenderEmail(),

                savedMessage
        );
    }

    // GET CHAT HISTORY

    @GetMapping("/history")
    public List<Message> getChatHistory(

            @RequestParam String user1,

            @RequestParam String user2
    ) {

        return messageService.getChat(
                user1,
                user2
        );
    }


    // RECENT CHATS

    @GetMapping("/recent")
    public List<ChatUserDTO>
    getRecentChats(

            @RequestParam
            String email
    ) {

        return messageService
                .getRecentChats(
                        email
                );
    }

    // UNREAD COUNT

    @GetMapping("/unread-count")
    public long getUnreadCount(

            @RequestParam
            String email
    ) {

        return messageService
                .getUnreadCount(
                        email
                );
    }


    // MARK AS SEEN

    @PostMapping("/mark-seen")
    public void markMessagesAsSeen(

            @RequestParam
            String senderEmail,

            @RequestParam
            String receiverEmail
    ) {

        messageService
                .markMessagesAsSeen(

                        senderEmail,

                        receiverEmail
                );
    }


    // DELETE MESSAGE

    @DeleteMapping("/delete/{id}")
    public void deleteMessage(

            @PathVariable
            Long id
    ) {

        messageService
                .deleteMessage(id);
    }


    // EDIT MESSAGE

    @PutMapping("/edit/{id}")
    public Message editMessage(

            @PathVariable
            Long id,

            @RequestParam
            String content
    ) {

        return messageService
                .editMessage(
                        id,
                        content
                );
    }

    // GET USER-WISE UNREAD COUNT

    @GetMapping("/unread-count/{senderEmail}")

    public long getUnreadCountFromUser(

            @PathVariable
            String senderEmail,

            Authentication authentication
    ) {

        String currentUser =

                authentication.getName();

        return messageService
                .getUnreadCountFromUser(

                        senderEmail,

                        currentUser
                );
    }
}