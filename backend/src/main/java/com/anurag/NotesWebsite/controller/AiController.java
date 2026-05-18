package com.anurag.NotesWebsite.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${groq.api.key}")
    private String apiKey;

    @PostMapping("/chat")
    public String chatWithAi(
            @RequestBody Map<String, String> body
    ) {

        try {

            String userMessage =
                    body.get("message");

            String url =
                    "https://api.groq.com/openai/v1/chat/completions";

            // HEADERS

            HttpHeaders headers =
                    new HttpHeaders();

            headers.setContentType(
                    MediaType.APPLICATION_JSON
            );

            headers.setBearerAuth(apiKey);

            // MESSAGE

            Map<String, String> message =
                    new HashMap<>();

            message.put(
                    "role",
                    "user"
            );

            message.put(
                    "content",
                    userMessage
            );

            // REQUEST BODY

            Map<String, Object> requestBody =
                    new HashMap<>();

            requestBody.put(
                    "model",
                    "llama-3.1-8b-instant"
            );

            requestBody.put(
                    "messages",
                    List.of(message)
            );

            HttpEntity<Map<String, Object>>
                    entity =
                    new HttpEntity<>(
                            requestBody,
                            headers
                    );

            // API CALL

            ResponseEntity<Map> response =
                    restTemplate.exchange(

                            url,

                            HttpMethod.POST,

                            entity,

                            Map.class
                    );

            // RESPONSE PARSE

            List choices =
                    (List) response.getBody()
                            .get("choices");

            Map firstChoice =
                    (Map) choices.get(0);

            Map messageResponse =
                    (Map) firstChoice
                            .get("message");

            return messageResponse
                    .get("content")
                    .toString();

        } catch (Exception e) {


            e.printStackTrace();

            return "AI error ❌";
        }
    }
}