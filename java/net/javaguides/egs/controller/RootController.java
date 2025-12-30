package net.javaguides.egs.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> info = new HashMap<>();
        info.put("message", "Exam Generator System API");
        info.put("version", "1.0.0");
        info.put("documentation", "/swagger-ui.html");
        info.put("apiDocs", "/v3/api-docs");
        return ResponseEntity.ok(info);
    }
}