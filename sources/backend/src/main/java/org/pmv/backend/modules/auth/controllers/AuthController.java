package org.pmv.backend.modules.auth.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.pmv.backend.common.reponse.ApiResponse;
import org.pmv.backend.modules.auth.dtos.accounts.LoginAccountDto;
import org.pmv.backend.modules.auth.services.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AccountService accountService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse.Success<LoginAccountDto.Response>> login(
            @Valid @RequestBody LoginAccountDto.Request request
    ) {
        ApiResponse.Success<LoginAccountDto.Response> response = accountService.login(request);
        return ResponseEntity.ok(response);
    }
}
