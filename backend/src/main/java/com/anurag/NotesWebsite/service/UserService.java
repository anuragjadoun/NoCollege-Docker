package com.anurag.NotesWebsite.service;

import com.anurag.NotesWebsite.dto.LoginRequest;
import com.anurag.NotesWebsite.dto.LoginResponse;
import com.anurag.NotesWebsite.entity.User;
import com.anurag.NotesWebsite.repository.DownloadRepository;
import com.anurag.NotesWebsite.repository.NoteRepository;
import com.anurag.NotesWebsite.repository.UserRepository;
import com.anurag.NotesWebsite.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


import com.anurag.NotesWebsite.dto.RegisterRequest;
import com.anurag.NotesWebsite.dto.OtpVerifyRequest;
import com.anurag.NotesWebsite.entity.OtpVerification;
import com.anurag.NotesWebsite.repository.OtpVerificationRepository;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;



    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private DownloadRepository downloadRepository;


    @Autowired
    private NotificationClientService notificationClientService;

    @Autowired
    private OtpVerificationRepository otpVerificationRepository;

    public Map<String, Object> getProfileWithStats(String email){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long uploads = noteRepository.countByUser_Email(email);
        long downloads = downloadRepository.countByUserEmail(email);

        Map<String, Object> data = new HashMap<>();
        data.put("user", user);
        data.put("uploads", uploads);
        data.put("downloads", downloads);

        return data;
    }

    //Register User
    public User registerUser(User user){

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        User savedUser = userRepository.save(user);

        String displayName =
                savedUser.getFullName() != null
                        ? savedUser.getFullName()
                        : "User";

        notificationClientService.sendEmail(
                savedUser.getEmail(),
                "Welcome to NoCollege 🎉",
                "Hello " + displayName +
                        ",\n\nWelcome to NoCollege!\n" +
                        "Your account has been created successfully.\n\n" +
                        "Start uploading notes and help students grow together 🚀"
        );

        return savedUser;
    }

    //find user by email
    public Optional<User> getUserByEmail(String email){
        return userRepository.findByEmail(email);
    }



    //Login user
    public LoginResponse loginUser(LoginRequest request){
        //request.getEmail is that which user send from the postman
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if(optionalUser.isEmpty()){
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        // CHECK PREMIUM EXPIRY

        if (

                Boolean.TRUE.equals(
                        user.getPremium()
                )

                        &&

                        user.getPremiumExpiry() != null

                        &&

                        user.getPremiumExpiry()

                                .isBefore(

                                        java.time.LocalDateTime.now()
                                )
        ) {

            user.setPremium(false);

            user.setPlan("FREE");

            user.setPremiumExpiry(null);

            userRepository.save(user);
        }

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse("Login successful",token);//return token instead of user.getEmail()
    }


    public User getUserProfile(String email){
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


//    public User updateProfile(String email, User updatedUser) {
//
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        user.setFullName(updatedUser.getFullName());
//        user.setBio(updatedUser.getBio());
//        user.setProfileImage(updatedUser.getProfileImage());
//
//        return userRepository.save(user);
//    }

    //  TOTAL USERS COUNT
    public long getTotalUsers() {

        return userRepository.count();
    }

    public User updateProfile(
            String email,
            User updatedUser
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        //  ONLY UPDATE IF NOT NULL

        if (updatedUser.getFullName() != null) {

            user.setFullName(
                    updatedUser.getFullName()
            );
        }

        if (updatedUser.getBio() != null) {

            user.setBio(
                    updatedUser.getBio()
            );
        }

        if (updatedUser.getProfileImage() != null) {

            user.setProfileImage(
                    updatedUser.getProfileImage()
            );
        }

        return userRepository.save(user);
    }

    public Map<String, Object> getPublicProfile(String email){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long uploads = noteRepository.countByUser_Email(email);

        long downloads = downloadRepository.countByUserEmail(email);

        Map<String, Object> data = new HashMap<>();

        data.put("user", user);
        data.put("uploads", uploads);
        data.put("downloads", downloads);

        return data;
    }



    public String sendOtp(RegisterRequest request) {

        // RANDOM 6 DIGIT OTP
        String otp = String.valueOf(
                100000 + new Random().nextInt(900000)
        );

        // DELETE OLD OTP IF EXISTS
        otpVerificationRepository.findByEmail(request.getEmail())
                .ifPresent(existingOtp ->
                        otpVerificationRepository.delete(existingOtp)
                );

        // SAVE NEW OTP
        OtpVerification otpData = new OtpVerification();

        otpData.setEmail(request.getEmail());

        otpData.setOtp(otp);

        otpData.setExpiryTime(
                LocalDateTime.now().plusMinutes(5)
        );

        otpVerificationRepository.save(otpData);

        // SEND EMAIL
        notificationClientService.sendEmail(
                request.getEmail(),
                "Your NoCollege OTP Verification 🔐",
                "Hello " + request.getName() +
                        ",\n\nYour OTP is: " + otp +
                        "\n\nThis OTP will expire in 5 minutes."
        );

        return "OTP sent successfully";
    }


    public User verifyOtpAndRegister(
            OtpVerifyRequest request
    ) {

        OtpVerification otpData =
                otpVerificationRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "OTP not found ❌"
                                )
                        );

        // OTP CHECK
        if (!otpData.getOtp().equals(request.getOtp())) {

            throw new RuntimeException(
                    "Invalid OTP ❌"
            );
        }

        // EXPIRY CHECK
        if (otpData.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "OTP expired ❌"
            );
        }

        // USER CREATE
        User user = new User();

        user.setName(request.getName());

        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        User savedUser = userRepository.save(user);

        // DELETE OTP AFTER SUCCESS
        otpVerificationRepository.delete(otpData);

        // WELCOME EMAIL
        notificationClientService.sendEmail(
                savedUser.getEmail(),
                "Welcome to NoCollege 🎉",
                "Hello " + savedUser.getName() +
                        ",\n\nYour account has been verified successfully 🚀"
        );

        return savedUser;
    }


}
