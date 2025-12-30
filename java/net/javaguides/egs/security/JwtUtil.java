package net.javaguides.egs.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(String email, String role, Long userId) {
        long currentTime = System.currentTimeMillis();
        Date issuedAt = new Date(currentTime);
        Date expiration = new Date(currentTime + jwtExpiration);
        
        return Jwts.builder()
            .setSubject(email)
            .claim("role", role)
            .claim("userId", userId.toString())
            .setIssuedAt(issuedAt)
            .setExpiration(expiration)
            .signWith(getSigningKey())
            .compact();
    }

    public Jws<Claims> validateAndParse(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token);
    }

    public String extractUserId(String token) {
        Claims claims = validateAndParse(token).getBody();
        return claims.get("userId", String.class);
    }
    
    public String extractEmail(String token) {
        Claims claims = validateAndParse(token).getBody();
        return claims.getSubject();
    }
    
    public String extractRole(String token) {
        Claims claims = validateAndParse(token).getBody();
        return claims.get("role", String.class);
    }
    
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = validateAndParse(token).getBody();
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}