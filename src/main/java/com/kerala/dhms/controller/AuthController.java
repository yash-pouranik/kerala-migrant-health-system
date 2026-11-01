package com.kerala.dhms.controller;

import com.kerala.dhms.dto.AuthDtos.*;
import com.kerala.dhms.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping({"/api/auth/login", "/auth/login"})
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping({"/api/auth/verify", "/auth/verify"})
    public ResponseEntity<?> verify(@RequestBody VerifyRequest request) {
        UserDto user = authService.verify(request.getToken());
        if (user != null) {
            Map<String, Object> body = new HashMap<>();
            body.put("success", true);
            body.put("user", user);
            return ResponseEntity.ok(body);
        } else {
            Map<String, Object> body = new HashMap<>();
            body.put("success", false);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }
    }

    @GetMapping({"/api/auth/google", "/auth/google"})
    public ResponseEntity<?> getGoogleAuthUrl() {
        String googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=47982363352-iqcmml15sbjh1n5d114839p6r4pnbrr6.apps.googleusercontent.com"
                + "&redirect_uri=http://localhost:5000/api/auth/callback/google"
                + "&response_type=code"
                + "&scope=openid%20email%20profile"
                + "&access_type=offline"
                + "&prompt=consent";

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("authUrl", googleAuthUrl);
        resp.put("redirectUri", "http://localhost:5000/api/auth/callback/google");
        return ResponseEntity.ok(resp);
    }

    @GetMapping({"/api/auth/callback/google", "/auth/callback/google"})
    public void googleCallback(@RequestParam(value = "code", required = false) String code, HttpServletResponse response) throws IOException {
        UserDto mockUser = UserDto.builder()
                .id(1L)
                .username("worker@kerala.gov")
                .name("Field Worker Demo")
                .role("Field Worker")
                .district("Wayanad")
                .loginMethod("google")
                .build();

        String token = java.util.Base64.getEncoder().encodeToString(("worker@kerala.gov:" + System.currentTimeMillis()).getBytes(StandardCharsets.UTF_8));
        String userJson = "{\"id\":1,\"username\":\"worker@kerala.gov\",\"name\":\"Field Worker Demo\",\"role\":\"Field Worker\",\"district\":\"Wayanad\",\"loginMethod\":\"google\"}";
        String encodedUser = URLEncoder.encode(userJson, StandardCharsets.UTF_8);

        String frontendUrl = "http://localhost:5173?token=" + token + "&user=" + encodedUser;
        response.sendRedirect(frontendUrl);
    }
}
