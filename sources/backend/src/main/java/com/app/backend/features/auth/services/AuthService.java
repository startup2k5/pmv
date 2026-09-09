package com.app.backend.features.auth.services;

import com.app.backend.common.exception.AppException;
import com.app.backend.common.exception.ErrorCode;
import com.app.backend.common.jwt.JwtService;
import com.app.backend.common.response.ApiResponse;
import com.app.backend.entities.Account;
import com.app.backend.features.auth.dtos.AuthDto;
import com.app.backend.features.auth.repositories.AuthRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor
public class AuthService {
    private final AuthRepository authRepository;
    private final JwtService jwtService;

    public ApiResponse.Success<AuthDto.Login.Response> login (AuthDto.Login.Request request) {
        Account account = authRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        String token = jwtService.generateToken(account, null, null);
        AuthDto.Login.Response response = new AuthDto.Login.Response();
        response.setToken(token);

        return ApiResponse.Success.ok("Login success", response);
    }
}
