package org.pmv.backend.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 400 - BAD REQUEST : Dữ liệu đầu vào không hợp lệ
    // 401 - UNAUTHORIZED: Chưa xác thực / token không hợp lệ
    // 403 - FORBIDDEN: Không có quyền truy cập
    // 404 - NOT FOUND: Không tìm thấy tài nguyên
    // 409 - CONFLICT: Dữ liệu đã tồn tại / xung đột
    // 500 - INTERNAL SERVER ERROR: Lỗi hệ thống, loi du lieu dau vao

    ACCOUNT_EXISTS("ACCOUNT_EXISTS", "Tài khoản đã tồn tại", HttpStatus.CONFLICT),
    PERMISSION_EXISTS("PERMISSION_EXISTS", "Mã quyền đã tồn tại", HttpStatus.CONFLICT),
    ROLE_EXISTS("ROLE_EXISTS", "Mã vai trò đã tồn tại", HttpStatus.CONFLICT),
    BRANCH_EXISTS("BRANCH_EXISTS", "Chi nhánh hoặc mã số thuế đã tồn tại", HttpStatus.CONFLICT),

    NOT_FOUND("NOT_FOUND", "Khong tim thay duong dan", HttpStatus.NOT_FOUND),
    ACCOUNT_NOTFOUND("ACCOUNT_NOTFOUND", "Tai khoan khong ton tai", HttpStatus.NOT_FOUND),
    PERMISSION_NOTFOUND("PERMISSION_NOTFOUND", "Không tìm thấy quyền", HttpStatus.NOT_FOUND),
    ROLE_NOTFOUND("ROLE_NOT_FOUND", "Vai trò không tồn tại", HttpStatus.NOT_FOUND),
    COMPANY_NOTFOUND("COMPANY_NOTFOUND", "Công ty không tồn tại", HttpStatus.NOT_FOUND),
    BRANCH_NOTFOUND("BRANCH_NOTFOUND", "Chi nhánh không tồn tại", HttpStatus.NOT_FOUND),
    ACCOUNT_LOCKED("ACCOUNT_LOCKED", "Tài khoản đã bị khóa hoặc ngừng hoạt động", HttpStatus.FORBIDDEN),
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "Tên đăng nhập hoặc mật khẩu không chính xác", HttpStatus.UNAUTHORIZED),
    ACCOUNT_NOT_ASSIGNED("ACCOUNT_NOT_ASSIGNED", "Tài khoản chưa được phân quyền trong hệ thống", HttpStatus.FORBIDDEN),
    EMPLOYEE_NOTFOUND("EMPLOYEE_NOTFOUND", "Thông tin nhân viên không tồn tại", HttpStatus.NOT_FOUND),

    UNSUPPORTED_MEDIA_TYPE("UNSUPPORTED_MEDIA_TYPE", "Dinh dang du lieu khong duoc ho tro", HttpStatus.UNSUPPORTED_MEDIA_TYPE),

    INVALID_INPUT("INVALID_INPUT", "Loi du lieu dau vao", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST_BODY("INVALID_REQUEST_BODY", "Vui long nhap day du thong tin", HttpStatus.BAD_REQUEST),
    MISSING_PARAMETER("MISSING_PARAMETER", "Loi truyen thieu bien", HttpStatus.BAD_REQUEST),

    METHOD_NOT_ALLOWED("METHOD_NOT_ALLOWED", "Phuong thuc khong ho tro", HttpStatus.METHOD_NOT_ALLOWED),


    INTERNAL_ERROR("INTERNAL_ERROR", "Lỗi hệ thống, vui lòng thử lại sau", HttpStatus.INTERNAL_SERVER_ERROR),
    DATABASE_ERROR("DATABASE_ERROR", "Lỗi cơ sở dữ liệu", HttpStatus.INTERNAL_SERVER_ERROR),
    ;

    private final String code;
    private final String msg;
    private final HttpStatus httpStatus;
}