package com.anurag.NotesWebsite.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key; //It's Important
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET ="mysecretkeymysecretkeymysecretkey12345";

    private final Key key= Keys.hmacShaKeyFor(SECRET.getBytes());

    //generate token
    public String generateToken(String email){
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+1000 * 60 * 60)) //for 1 hour
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract email from token
    public String extractEmail(String token){
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    //validate token
    public boolean validateToken(String token, String email){
        return extractEmail(token).equals(email) &&  !isTokenExpired(token);
    }

    //check expiration
    public boolean isTokenExpired(String token){
       Date expiration = Jwts.parserBuilder().setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();

        return expiration.before(new Date());
    }
}
