package com.anurag.notificationservice.service;

import com.anurag.notificationservice.dto.EmailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public String sendEmail(EmailRequest request) {

        try {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(request.getTo());
            message.setSubject(request.getSubject());
            message.setText(request.getMessage());

            mailSender.send(message);

            return "Email sent successfully";

        } catch (Exception e) {

            e.printStackTrace();

            return "Failed to send email";
        }
    }
}