package com.anurag.NotesWebsite.controller;

//import com.anurag.NotesWebsite.entity.User;
import com.anurag.NotesWebsite.entity.User;
import com.anurag.NotesWebsite.repository.UserRepository;
import com.anurag.NotesWebsite.security.JwtUtil;
import com.anurag.NotesWebsite.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;


    //  TOTAL USERS COUNT API
    @GetMapping("/count")
    public long getUsersCount() {

        return userRepository.count();
    }

    // GET PROFILE
    @GetMapping("/profile")
    public Map<String, Object> getProfile(HttpServletRequest request){

        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractEmail(token);

        return userService.getProfileWithStats(email);
    }



    @PostMapping("/profile/upload-image")
    public User uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) {

        try {

            //  TOKEN
            String token = request.getHeader("Authorization").substring(7);

            String email = jwtUtil.extractEmail(token);

            //  FOLDER CREATE
            String uploadDir = "uploads/profile/";

            Files.createDirectories(Paths.get(uploadDir));

            //  UNIQUE FILE NAME
            String fileName = System.currentTimeMillis()
                    + "_"
                    + file.getOriginalFilename();

            //  PATH
            Path path = Paths.get(uploadDir + fileName);

            //  SAVE FILE
            Files.write(path, file.getBytes());

            //  SAVE IN DATABASE
            User user = new User();

            user.setProfileImage("uploads/profile/" + fileName);

            return userService.updateProfile(email, user);

        } catch (Exception e) {

            System.out.println(e.getMessage());

            throw new RuntimeException("Image upload failed ❌");
        }
    }


    @PutMapping("/profile/update")
    public User updateProfile(
            @RequestBody User updatedUser,
            HttpServletRequest request
    ) {



        String token =
                request.getHeader("Authorization")
                        .substring(7);

        String email = jwtUtil.extractEmail(token);

        return userService.updateProfile(
                email,
                updatedUser
        );
    }

    @GetMapping("/profile/{email}")
    public Map<String, Object> getPublicProfile(
            @PathVariable String email
    ){

        return userService.getPublicProfile(email);
    }


}