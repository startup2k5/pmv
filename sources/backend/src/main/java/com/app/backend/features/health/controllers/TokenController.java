package com.app.backend.features.health.controllers;

import com.app.backend.common.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class TokenController {

    private final JwtUtil jwtUtil;

    @GetMapping("/v1/health/token")
    public UUID testToken(@RequestHeader("Authorization") String token) {
        return jwtUtil.getAccountUuid(token);
    }
}
