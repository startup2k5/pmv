package org.pmv.backend.modules.me.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.pmv.backend.common.exception.AppException;
import org.pmv.backend.common.exception.ErrorCode;
import org.pmv.backend.common.reponse.ApiResponse;
import org.pmv.backend.modules.me.dtos.MeDto;
import org.pmv.backend.modules.me.services.MeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/me")
@RequiredArgsConstructor
public class MeController {

    private final MeService meService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<MeDto.Response>> getMe(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        String token = authHeader.substring(7).trim();
        ApiResponse.Success<MeDto.Response> response = meService.getMeFromToken(token);
        return ResponseEntity.ok(response);
    }
}
