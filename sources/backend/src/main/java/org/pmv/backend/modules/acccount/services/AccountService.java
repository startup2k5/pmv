package org.pmv.backend.modules.acccount.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.pmv.backend.common.exception.AppException;
import org.pmv.backend.common.exception.ErrorCode;
import org.pmv.backend.common.reponse.ApiResponse;
import org.pmv.backend.entities.Account;
import org.pmv.backend.entities.Branch;
import org.pmv.backend.entities.Employee;
import org.pmv.backend.entities.Role;
import org.pmv.backend.modules.acccount.dto.AccountDto;
import org.pmv.backend.modules.acccount.dto.ChangePasswordDto;
import org.pmv.backend.modules.acccount.repositories.AccountRepository;
import org.pmv.backend.modules.branch.repositories.EmployeeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;



@Service
@Slf4j
@AllArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Lay thong tin 1 tai khoan qua token
     */
    public ApiResponse.Success<AccountDto.Response> getInforMe(UUID uuid) {
        Account account = accountRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOTFOUND));

        Employee employee = employeeRepository.findById(account.getId())
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOTFOUND));

        Branch branch = employee.getBranch();
        Role role = employee.getRole();

        AccountDto.Response response = new AccountDto.Response();
        response.setRole(role);
        response.setBranch(branch);
        response.setPermissions(null);

        return ApiResponse.Success.ok("Lấy thông tin tài khoản thành công", response);
    }

    public ApiResponse.Success<?> updatePasswordAccount(UUID uuid, ChangePasswordDto.Request request) {
        Account account = accountRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOTFOUND));

        if(!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        };

        Employee employee = employeeRepository.findById(account.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_ASSIGNED));

        if (Boolean.FALSE.equals(employee.getIsActive())) {
            throw new AppException(ErrorCode.ACCOUNT_LOCKED);
        }

        String newPasswordHash = passwordEncoder.encode(request.getNewPassword());
        accountRepository.updatePasswordNative(newPasswordHash, account.getUuid());

        return ApiResponse.Success.ok("Thay doi mat khau thanh cong", null);
    }


}
