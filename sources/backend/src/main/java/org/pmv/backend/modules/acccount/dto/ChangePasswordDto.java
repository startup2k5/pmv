package org.pmv.backend.modules.acccount.dto;

import lombok.Data;

public class ChangePasswordDto {
    @Data
    public static class Request
    {
        private String password;
        private String newPassword;
    }
}
