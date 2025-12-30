package net.javaguides.egs.controller;

import lombok.RequiredArgsConstructor;
import net.javaguides.egs.dto.AuthRequest;
import net.javaguides.egs.dto.AuthResponse;
import net.javaguides.egs.dto.UserProfileDTO;
import net.javaguides.egs.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        try {
            String result = authService.register(req);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        try {
            AuthResponse response = authService.login(req);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", e.getMessage());
            return ResponseEntity.status(401).body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserInfo(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(error);
        }

        String email = authentication.getName();
        var user = authService.findUserByEmail(email);
        
        if (user.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", "User not found");
            return ResponseEntity.status(404).body(error);
        }

        var userEntity = user.get();
        UserProfileDTO profile = new UserProfileDTO(
            userEntity.getId(),
            userEntity.getName(),
            userEntity.getEmail(),
            userEntity.getRole().name()
        );
        return ResponseEntity.ok(profile);
    }
}
