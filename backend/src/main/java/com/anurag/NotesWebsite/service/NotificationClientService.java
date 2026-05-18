package com.anurag.NotesWebsite.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationClientService {

    @Autowired
    private RestTemplate restTemplate;

    private final String NOTIFICATION_URL =
            "https://nocollege-docker-1.onrender.com/email/send";

    public void sendEmail(
            String to,
            String subject,
            String message
    ) {

        try {

            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = new HashMap<>();

            body.put("to", to);
            body.put("subject", subject);
            body.put("message", message);

            HttpEntity<Map<String, String>> request =
                    new HttpEntity<>(body, headers);

            restTemplate.postForObject(
                    NOTIFICATION_URL,
                    request,
                    String.class
            );

        } catch (Exception e) {

            System.out.println(
                    "Notification service failed ❌"
            );

            e.printStackTrace();
        }
    }
}