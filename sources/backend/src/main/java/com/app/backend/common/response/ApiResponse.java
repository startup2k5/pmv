package com.app.backend.common.response;

import lombok.*;

public class ApiResponse {
    @Data
    @Builder
    public static class Success<T> {
        private boolean success;
        private String msg;
        private T data;

        public static  <T> Success <T> ok(String msg, T data) {
            return Success.<T>builder().success(true).msg(msg).data(data).build();
        }
    }

    @Data
    @Builder
    public static class Error<T> {
        private String type;
        private String code;
        private int status;
        private String detail;
        private String instance;
        private T errors;

        public static <T> Error<T> err(String code, int status, String detail, String instance, T errors) {
            return Error.<T>builder()
                    .type("about:blank")
                    .code(code)
                    .status(status)
                    .detail(detail)
                    .instance(instance)
                    .errors(errors)
                    .build();
        }
    }
}
