package org.pmv.backend.common.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.pmv.backend.connfigs.JwtConfig;
import org.pmv.backend.entities.Account;
import org.pmv.backend.entities.Branch;
import org.pmv.backend.entities.Role;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtConfig jwtConfig;

    private SecretKey getSignKey() {
        return Keys.hmacShaKeyFor(
                jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8)
        );
    }


    public String generateToken(Account account) {
        Instant now = Instant.now();
        var builder = Jwts.builder()
                .issuer(jwtConfig.getIssuer())                                  // iss: Bên phát hành token
                .subject(account.getId().toString())                            // sub: Chủ thể (Account ID)
                .issuedAt(Date.from(now))                                       // iat: Thời điểm phát hành
                .notBefore(Date.from(now))                                      // nbf: Không hợp lệ trước thời điểm này
                .expiration(Date.from(now.plusMillis(jwtConfig.getExpiration()))) // exp: Thời điểm hết hạn
                .id(UUID.randomUUID().toString())                               // jti: ID duy nhất của token
                .claim(JwtClaim.UUID, account.getUuid().toString());
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
