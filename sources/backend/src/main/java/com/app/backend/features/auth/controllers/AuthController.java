package com.app.backend.features.auth.controllers;

import com.app.backend.common.response.ApiResponse;
import com.app.backend.features.auth.dtos.AuthDto;
import com.app.backend.features.auth.services.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/v1/auth/login")
    public ResponseEntity<ApiResponse.Success<?>> loginController (@RequestBody AuthDto.Login.Request request) {
        ApiResponse.Success<AuthDto.Login.Response> response = authService.login(request);
        return ResponseEntity.ok(response);
    }


}
