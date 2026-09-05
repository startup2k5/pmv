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

        Employee employee = employeeRepository.findByIdWithRoleAndBranch(account.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_ASSIGNED));

        if (Boolean.FALSE.equals(employee.getIsActive())) {
            throw new AppException(ErrorCode.ACCOUNT_LOCKED);
        }

        Role role = employee.getRole();
        Branch branch = employee.getBranch();

        // Phân loại vai trò
        boolean isSystemAdmin = "SYSTEM_ADMIN".equalsIgnoreCase(role.getCode())
                || "SYS_ADMIN".equalsIgnoreCase(role.getCode());

        boolean isBranchAdmin = ("BRANCH_ADMIN".equalsIgnoreCase(role.getCode())
                || "BRANCH_MANAGER".equalsIgnoreCase(role.getCode())
                || (role.getCode() != null && role.getCode().toUpperCase().contains("ADMIN")))
                && "BRANCH".equalsIgnoreCase(role.getScope());

        // Lấy đúng danh sách quyền theo vai trò để đóng gói vào Token:
        // - SYSTEM_ADMIN: Full SYSTEM + ALL
        // - BRANCH_ADMIN: Full BRANCH + ALL
        // - Nhân viên thường: ALL + quyền được cấp phép trong role_permissions
        List<String> permissions = isSystemAdmin
                ? permissionRepository.findCodesByScopeIn(List.of("SYSTEM", "ALL"))
                : isBranchAdmin
                ? permissionRepository.findCodesByScopeIn(List.of("BRANCH", "ALL"))
                : permissionRepository.findAllowedCodesForStaff(role.getId(), role.getScope());

        // Đóng gói id, uuid, username, role_code, role_name, scope, branch_id, permissions vào Token
        String token = jwtService.generateToken(account, role, branch, permissions);

        LoginAccountDto.Response response = LoginAccountDto.Response.builder()
                .token(token)
                .build();

        return ApiResponse.Success.ok("Dang nhap tai khoan thanh cong", response);
    }
}
