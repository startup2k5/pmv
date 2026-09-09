package com.app.backend.common.jwt;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final JwtService jwtService;

    private Claims parse(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7).trim();
        }
        return jwtService.parse(token);
    }

    public Long getAccountId(String token) {
        Claims claims = parse(token);

        return Long.parseLong(claims.getSubject());
    }

    public UUID getAccountUuid(String token) {
        Claims claims = parse(token);

        return UUID.fromString(
                claims.get(JwtClaim.ACCOUNT_UUID, String.class)
        );
    }

    public UUID getRoleUuid(String token) {
        Claims claims = parse(token);

        return UUID.fromString(
                claims.get(JwtClaim.ROLE_UUID, String.class)
        );
    }

    public UUID getBranchUuid(String token) {
        Claims claims = parse(token);

        return UUID.fromString(
                claims.get(JwtClaim.BRANCH_UUID, String.class)
        );
    }

    public UUID getCompanyUuid(String token) {
        Claims claims = parse(token);

        return UUID.fromString(
                claims.get(JwtClaim.COMPANY_UUID, String.class)
        );
    }
}
