package com.app.backend.common.response;

import lombok.Data;

@Data
public class SqlResponse<T> {
    private boolean success;
    private String errors;
    private String message;
    private T data;

}
