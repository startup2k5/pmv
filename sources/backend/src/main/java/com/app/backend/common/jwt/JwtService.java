package com.app.backend.common.jwt;

import com.app.backend.configs.JwtConfig;
import com.app.backend.entities.Account;
import com.app.backend.entities.Branch;
import com.app.backend.entities.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtConfig jwtConfig;

    private SecretKey getSignKey() {
        return Keys.hmacShaKeyFor(
                jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generateToken(Account account, Role role, Branch branch) {
        Instant now = Instant.now();
        var builder = Jwts.builder()
                .issuer(jwtConfig.getIssuer())                                      // iss: Bên phát hành token
                .subject(account.getId().toString())                                // sub: Chủ thể (Account ID)
                .issuedAt(Date.from(now))                                           // iat: Thời điểm phát hành
                .notBefore(Date.from(now))                                          // nbf: Không hợp lệ trước thời điểm này
                .expiration(Date.from(now.plusMillis(jwtConfig.getExpiration())))   // exp: Thời điểm hết hạn
                .id(UUID.randomUUID().toString())                                   // jti: ID duy nhất của token
                .claim(JwtClaim.ACCOUNT_UUID, account.getUuid().toString());

        if (role != null && role.getUuid() != null) {
            builder.claim(
                    JwtClaim.ROLE_UUID,
                    role.getUuid().toString()
            );
        }

        if (branch != null && branch.getUuid() != null) {
            builder.claim(
                    JwtClaim.BRANCH_UUID,
                    branch.getUuid().toString()
            );
        }

        if (branch != null
                && branch.getCompany() != null
                && branch.getCompany().getUuid() != null) {

            builder.claim(
                    JwtClaim.COMPANY_UUID,
                    branch.getCompany().getUuid().toString()
            );
        }
        return builder.signWith(getSignKey())
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
