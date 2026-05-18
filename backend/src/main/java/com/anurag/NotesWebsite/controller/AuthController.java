package com.anurag.NotesWebsite.controller;

import com.anurag.NotesWebsite.dto.LoginRequest;
import com.anurag.NotesWebsite.dto.LoginResponse;
import com.anurag.NotesWebsite.entity.User;
import com.anurag.NotesWebsite.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.anurag.NotesWebsite.dto.RegisterRequest;
import com.anurag.NotesWebsite.dto.OtpVerifyRequest;

@RestController //This class will handle the api
@RequestMapping("api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user){
        return userService.registerUser(user);
    }


    /*When we send data from postman like this
        {
            "email": "anurag2@gmail.com",
            "password": "123456"
    }
    Then it goes to the loginUser method inside UserService and i am passing the LoginRequest object in that
    */

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){
        return userService.loginUser(request);
    }

    @PostMapping("/send-otp")
    public String sendOtp(
            @RequestBody RegisterRequest request
    ) {

        return userService.sendOtp(request);
    }


    @PostMapping("/verify-otp")
    public User verifyOtp(
            @RequestBody OtpVerifyRequest request
    ) {

        return userService.verifyOtpAndRegister(request);
    }
}
