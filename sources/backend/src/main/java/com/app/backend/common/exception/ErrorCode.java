package com.app.backend.common.exception;

// 400 - BAD REQUEST: Invalid request / validation error
// 401 - UNAUTHORIZED: Authentication required / invalid or expired token
// 403 - FORBIDDEN: Insufficient permissions
// 404 - NOT FOUND: Resource or API endpoint not found
// 409 - CONFLICT: Resource already exists / data conflict
// 500 - INTERNAL SERVER ERROR: System error / unexpected server error

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOTFOUND("USER_NOTFOUND", "Username not found", HttpStatus.NOT_FOUND),

    SERVER_INTERNAL("SERVER_INTERNAL", "Internal server error. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR),
    ;

    private final String code;
    private final String msg;
    private final HttpStatus status;
}
