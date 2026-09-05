package org.pmv.backend.modules.acccount.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.pmv.backend.common.exception.AppException;
import org.pmv.backend.common.exception.ErrorCode;
import org.pmv.backend.common.jwt.JwtClaim;
import org.pmv.backend.common.jwt.JwtService;
import org.pmv.backend.common.reponse.ApiResponse;
import org.pmv.backend.entities.Branch;
import org.pmv.backend.modules.acccount.dto.AccountDto;
import org.pmv.backend.modules.acccount.repositories.AccountRepository;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@AllArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final JwtService jwtService;

    /**
     * Lay thong tin 1 tai khoan qua token
     */
    public ApiResponse.Success<AccountDto.Response> getInforAccount(String token) {
        try {
            Claims claims = jwtService.parse(token);
            String uuid = claims.get(JwtClaim.UUID, String.class);

            Branch branch =
            return
        } catch (Exception e) {
            log.error("Khong the doc claim tu token: {}", e.getMessage());
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
    }
}
