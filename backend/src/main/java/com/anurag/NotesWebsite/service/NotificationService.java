package com.anurag.NotesWebsite.service;

import com.anurag.NotesWebsite.entity.Notification;
import com.anurag.NotesWebsite.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // SAVE NOTIFICATION
    public void createNotification(
            String userEmail,
            String message
    ) {

        Notification notification =
                new Notification();

        notification.setUserEmail(
                userEmail
        );

        notification.setMessage(
                message
        );

        notification.setCreatedAt(
                LocalDateTime.now()
        );

        notificationRepository.save(
                notification
        );
    }

    // GET USER NOTIFICATIONS
    public List<Notification> getUserNotifications(
            String email
    ) {

        return notificationRepository
                .findByUserEmailOrderByCreatedAtDesc(
                        email
                );
    }


    // UNREAD COUNT
    public long getUnreadCount(String email) {

        return notificationRepository
                .countByUserEmailAndReadFalse(
                        email
                );
    }


    // MARK ALL AS READ
    public void markAllAsRead(String email) {

        List<Notification> notifications =
                notificationRepository
                        .findByUserEmailOrderByCreatedAtDesc(
                                email
                        );

        for (Notification n : notifications) {

            n.setRead(true);
        }

        notificationRepository.saveAll(notifications);
    }

}