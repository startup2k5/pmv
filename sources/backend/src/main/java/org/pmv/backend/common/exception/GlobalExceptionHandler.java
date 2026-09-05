package org.pmv.backend.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.pmv.backend.common.reponse.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Lỗi có chủ đích
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse.Error<?>> handleAppException(AppException ex, HttpServletRequest req) {
        log.warn("AppException at {}: [{}] {}", req.getRequestURI(), ex.getErrorCode().getCode(), ex.getErrorCode().getMsg());
        return buildError(ex.getErrorCode(), req);
    }

    // Loi validation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse.Error<?>> handleNotValid (MethodArgumentNotValidException ex, HttpServletRequest req) {
        return buildError(ErrorCode.INVALID_INPUT, req);
    }

    // Loi method khong ho tro
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse.Error<?>> handleNotSupportMethor (HttpRequestMethodNotSupportedException ex, HttpServletRequest req) {
        return buildError(ErrorCode.METHOD_NOT_ALLOWED, req);
    }

    // Bắt lỗi sai Content-Type (VD: gửi text thay vì JSON)
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiResponse.Error<?>> handleTypeNotSupport(HttpMediaTypeNotSupportedException ex, HttpServletRequest req) {
        return buildError(ErrorCode.UNSUPPORTED_MEDIA_TYPE, req);
    }

    // Bắt lỗi body JSON không hợp lệ hoặc thiếu body
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse.Error<?>> handleNotReadable (HttpMessageNotReadableException ex, HttpServletRequest req) {
        return buildError(ErrorCode.INVALID_REQUEST_BODY, req);
    }

    // Bắt lỗi thiếu request parameter
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse.Error<?>> handleReuestParameter (MissingServletRequestParameterException ex, HttpServletRequest req) {
        return buildError(ErrorCode.MISSING_PARAMETER, req);
    }

    // Lỗi không tìm thấy đường dẫn API
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiResponse.Error<?>> handleNotFound(NoHandlerFoundException ex, HttpServletRequest req) {
        return buildError(ErrorCode.NOT_FOUND, req);
    }

    // Lỗi hệ thống không mong muốn
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse.Error<?>> handleException(Exception ex, HttpServletRequest req) {
        log.error("Unexpected error at {}: {}", req.getRequestURI(), ex.getMessage(), ex);
        return buildError(ErrorCode.INTERNAL_ERROR, req);
    }

    // Helper: tránh lặp code
    private ResponseEntity<ApiResponse.Error<?>> buildError(ErrorCode errorCode, HttpServletRequest req) {
        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(ApiResponse.Error.err(
                        errorCode.getCode(),
                        errorCode.getHttpStatus().value(),
                        errorCode.getMsg(),
                        req.getRequestURI(),
                        null
                ));
    }
}