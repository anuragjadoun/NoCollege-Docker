package com.anurag.NotesWebsite.controller;

import com.razorpay.Order;

import com.razorpay.RazorpayClient;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.web.bind.annotation.*;

import com.anurag.NotesWebsite.entity.User;

import com.anurag.NotesWebsite.repository.UserRepository;

import java.time.LocalDateTime;

import org.springframework.security.core.Authentication;

import org.springframework.http.ResponseEntity;

@RestController

@RequestMapping("/api/payment")

//@CrossOrigin("*")

public class PaymentController {



    @Autowired
    private final UserRepository userRepository;

    public PaymentController(

            UserRepository userRepository
    ) {

        this.userRepository = userRepository;
    }

    @Value("${razorpay.key}")
    private String razorpayKey;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    @PostMapping("/create-order")

    public String createOrder(

            @RequestParam int amount

    ) throws Exception {

        RazorpayClient client =

                new RazorpayClient(
                        razorpayKey,
                        razorpaySecret
                );

        JSONObject options =
                new JSONObject();

        options.put(
                "amount",
                amount * 100
        );

        options.put(
                "currency",
                "INR"
        );

        options.put(
                "receipt",
                "txn_123456"
        );

        Order order =
                client.orders.create(options);

        return order.toString();
    }


    @PostMapping("/activate-plan")

    public String activatePlan(

            @RequestParam String plan,

            Authentication authentication
    ) {

        String email =
                authentication.getName();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow();

        user.setPremium(true);

        user.setPlan(plan);

        user.setPremiumExpiry(

                LocalDateTime.now()
                        .plusDays(30)
        );

        userRepository.save(user);

        return "Plan Activated ✅";
    }



    @PostMapping("/cancel-plan")
    public ResponseEntity<?> cancelPlan(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow();

        user.setPremium(false);

        user.setPlan("FREE");

        user.setPremiumExpiry(null);

        userRepository.save(user);

        return ResponseEntity.ok(
                "Plan cancelled"
        );
    }


}