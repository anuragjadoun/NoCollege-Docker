package com.anurag.notificationservice.controller;

import com.anurag.notificationservice.dto.EmailRequest;
import com.anurag.notificationservice.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
@CrossOrigin("*")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public String sendEmail(@RequestBody EmailRequest request) {

        return emailService.sendEmail(request);
    }
}