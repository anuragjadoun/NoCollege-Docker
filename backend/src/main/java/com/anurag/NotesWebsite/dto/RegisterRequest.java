package com.anurag.NotesWebsite.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    private String name;

    private String email;

    private String password;
}



//from frontend

//{
//        "name":"Anurag",
//        "email":"anurag@gmail.com",
//        "password":"123456"
//        }