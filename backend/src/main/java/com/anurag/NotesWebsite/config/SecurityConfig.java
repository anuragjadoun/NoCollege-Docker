package com.anurag.NotesWebsite.config;

import com.anurag.NotesWebsite.filter.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {

        try {

            http
                    .cors(cors -> {})
                    .csrf(csrf -> csrf.disable())

                    .authorizeHttpRequests(auth -> auth

                            // PUBLIC
                            .requestMatchers("/api/auth/**").permitAll()

                            .requestMatchers("/api/user/count").permitAll()

                            .requestMatchers("/api/user/profile/**").permitAll()

                            .requestMatchers("/uploads/**").permitAll()

                            .requestMatchers("/api/notes/all").permitAll()

                            .requestMatchers("/api/notes/search").permitAll()

                            .requestMatchers("/api/notes/comments/**").permitAll()

                            .requestMatchers("/api/notes/likes/**").permitAll()

                            // PROTECTED
                            .requestMatchers("/api/notes/comment/**").authenticated()

                            .requestMatchers("/api/notes/like/**").authenticated()

                            .requestMatchers("/api/notes/download/**").authenticated()

                            .requestMatchers("/api/notes/upload").authenticated()

                            .requestMatchers("/api/user/profile/update").authenticated()

                            // EVERYTHING ELSE
                            .anyRequest().permitAll()
                    )

                    .sessionManagement(session ->
                            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    );

            http.addFilterBefore(
                    jwtFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

            return http.build();

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}