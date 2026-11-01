package com.kerala.dhms.service;

import com.kerala.dhms.dto.AuthDtos.*;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class AuthService {

    private final List<UserDto> users = Arrays.asList(
            UserDto.builder().id(1L).username("admin@kerala.gov").name("Dr. Arun Kumar").role("Super Admin").district("All").build(),
            UserDto.builder().id(2L).username("wayanad@kerala.gov").name("Dr. Priya Menon").role("District Admin").district("Wayanad").build(),
            UserDto.builder().id(3L).username("worker").name("Rajesh K").role("Field Worker").district("Wayanad").build(),
            UserDto.builder().id(4L).username("phc").name("Nurse Anjali").role("PHC Staff").district("Wayanad").build()
    );

    private final Map<String, String> credentials = new HashMap<>() {{
        put("admin@kerala.gov", "admin");
        put("wayanad@kerala.gov", "district");
        put("worker", "worker");
        put("phc", "phc");
    }};

    public LoginResponse login(LoginRequest request) {
        if ("google".equalsIgnoreCase(request.getProvider()) || "facebook".equalsIgnoreCase(request.getProvider())) {
            UserDto mockUser = users.get(0);
            String token = Base64.getEncoder().encodeToString((mockUser.getUsername() + ":" + System.currentTimeMillis()).getBytes(StandardCharsets.UTF_8));
            UserDto userDto = UserDto.builder()
                    .id(mockUser.getId())
                    .username(mockUser.getUsername())
                    .name(mockUser.getName())
                    .role(mockUser.getRole())
                    .district(mockUser.getDistrict())
                    .loginMethod(request.getProvider())
                    .build();
            return LoginResponse.builder().success(true).token(token).user(userDto).build();
        }

        String username = request.getUsername();
        String password = request.getPassword();

        if (username != null && credentials.containsKey(username) && credentials.get(username).equals(password)) {
            UserDto user = users.stream().filter(u -> u.getUsername().equalsIgnoreCase(username)).findFirst().orElse(null);
            if (user != null) {
                String token = Base64.getEncoder().encodeToString((user.getUsername() + ":" + System.currentTimeMillis()).getBytes(StandardCharsets.UTF_8));
                return LoginResponse.builder().success(true).token(token).user(user).build();
            }
        }

        return LoginResponse.builder().success(false).message("Invalid credentials").build();
    }

    public UserDto verify(String token) {
        if (token == null || token.isBlank()) return null;
        try {
            byte[] decoded = Base64.getDecoder().decode(token);
            String str = new String(decoded, StandardCharsets.UTF_8);
            String loginId = str.split(":")[0];
            return users.stream().filter(u -> u.getUsername().equalsIgnoreCase(loginId)).findFirst().orElse(null);
        } catch (Exception e) {
            return null;
        }
    }
}
