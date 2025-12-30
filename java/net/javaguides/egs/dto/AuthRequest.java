package net.javaguides.egs.dto;

import lombok.Data;
import net.javaguides.egs.Role;

@Data
public class AuthRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}