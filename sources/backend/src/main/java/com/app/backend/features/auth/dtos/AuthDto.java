package com.app.backend.features.auth.dtos;

import lombok.Data;

public class AuthDto {
    public static class Login {
        @Data
        public static class Request {
            private String username;
            private String password;

        }

        @Data
        public static class Response {
            private String token;
        }
    }

    public static class Register {
        @Data
        public static class Request {
            private Long companyId;
            private Long brandId;
            private Long roleId;

            private String username;
            private String password;
            
        }
    }
}
