package org.pmv.backend.modules.acccount.controllers;

import lombok.AllArgsConstructor;
import org.pmv.backend.common.reponse.ApiResponse;
import org.pmv.backend.modules.acccount.dto.AccountDto;
import org.pmv.backend.modules.acccount.dto.ChangePasswordDto;
import org.pmv.backend.modules.acccount.services.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/account")
public class AccountController {
    private final AccountService accountService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse.Success<AccountDto.Response>> getMeAccount(Authentication authentication) {
        UUID uuid = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(accountService.getInforMe(uuid));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse.Success<?>> changePassword(Authentication authentication, @RequestBody ChangePasswordDto.Request request) {
        UUID uuid = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(accountService.updatePasswordAccount(uuid, request));
    }
}
