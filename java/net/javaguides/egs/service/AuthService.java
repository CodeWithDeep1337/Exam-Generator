package net.javaguides.egs.service;

import lombok.RequiredArgsConstructor;
import net.javaguides.egs.Role;
import net.javaguides.egs.User;
import net.javaguides.egs.UserRepository;
import net.javaguides.egs.dto.AuthRequest;
import net.javaguides.egs.dto.AuthResponse;
import net.javaguides.egs.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String register(AuthRequest req) {
        Optional<User> existingUser = userRepository.findByEmail(req.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        Role userRole = req.getRole();
        if (userRole == null) {
            userRole = Role.STUDENT;
        }

        User newUser = new User();
        newUser.setName(req.getName());
        newUser.setEmail(req.getEmail());
        newUser.setPassword(passwordEncoder.encode(req.getPassword()));
        newUser.setRole(userRole);
        
        userRepository.save(newUser);
        return "User registered successfully";
    }

    public AuthResponse login(AuthRequest req) {
        Optional<User> userOpt = userRepository.findByEmail(req.getEmail());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userOpt.get();
        boolean passwordMatch = passwordEncoder.matches(req.getPassword(), user.getPassword());
        if (!passwordMatch) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        AuthResponse response = new AuthResponse(token, user.getRole().name());
        return response;
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}