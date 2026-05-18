package com.anurag.NotesWebsite.dto;

import lombok.Data;

@Data
public class OtpVerifyRequest {

    private String name;

    private String email;

    private String password;

    private String otp;
}






//{
//        "name":"Anurag",
//        "email":"anurag@gmail.com",
//        "password":"123456",
//        "otp":"834291"
//        }