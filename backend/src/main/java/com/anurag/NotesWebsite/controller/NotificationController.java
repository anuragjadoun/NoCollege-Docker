package com.anurag.NotesWebsite.controller;

import com.anurag.NotesWebsite.entity.Notification;
import com.anurag.NotesWebsite.security.JwtUtil;
import com.anurag.NotesWebsite.service.NotificationService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JwtUtil jwtUtil;

    // GET ALL NOTIFICATIONS
    @GetMapping
    public List<Notification> getNotifications(
            HttpServletRequest request
    ) {

        String token =
                request.getHeader("Authorization")
                        .substring(7);

        String email =
                jwtUtil.extractEmail(token);

        return notificationService
                .getUserNotifications(email);
    }


    // GET UNREAD COUNT
    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(
            HttpServletRequest request
    ) {

        String token =
                request.getHeader("Authorization")
                        .substring(7);

        String email =
                jwtUtil.extractEmail(token);

        long count =
                notificationService
                        .getUnreadCount(email);

        Map<String, Long> data =
                new HashMap<>();

        data.put("count", count);

        return data;
    }

    // MARK ALL AS READ
    @PutMapping("/mark-read")
    public String markAllAsRead(
            HttpServletRequest request
    ) {

        String token =
                request.getHeader("Authorization")
                        .substring(7);

        String email =
                jwtUtil.extractEmail(token);

        notificationService.markAllAsRead(email);

        return "Notifications marked as read";
    }
}