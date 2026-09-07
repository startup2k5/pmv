package org.pmv.backend.modules.auth.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.pmv.backend.common.exception.AppException;
import org.pmv.backend.common.exception.ErrorCode;
import org.pmv.backend.common.jwt.JwtService;
import org.pmv.backend.common.reponse.ApiResponse;
import org.pmv.backend.entities.*;
import org.pmv.backend.modules.auth.dtos.accounts.LoginAccountDto;
import org.pmv.backend.modules.auth.repositories.AccountRepository;
import org.pmv.backend.modules.auth.repositories.PermissionRepository;
import org.pmv.backend.modules.branch.repositories.EmployeeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final EmployeeRepository employeeRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public ApiResponse.Success<LoginAccountDto.Response> login(LoginAccountDto.Request request) {
        Account account = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOTFOUND));

        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        Employee employee = employeeRepository.findById(account.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_ASSIGNED));

        if (Boolean.FALSE.equals(employee.getIsActive())) {
            throw new AppException(ErrorCode.ACCOUNT_LOCKED);
        }

        String token = jwtService.generateToken(account);

        LoginAccountDto.Response response = LoginAccountDto.Response.builder()
                .token(token)
                .build();

        return ApiResponse.Success.ok("Dang nhap tai khoan thanh cong", response);
    }
}
