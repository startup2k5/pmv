package org.pmv.backend.modules.auth.dtos.roles;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class RoleDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "Mã vai trò không được để trống")
        @Size(max = 50, message = "Mã vai trò tối đa 50 ký tự")
        private String code;

        @NotBlank(message = "Tên vai trò không được để trống")
        @Size(max = 100, message = "Tên vai trò tối đa 100 ký tự")
        private String name;

        @NotBlank(message = "Phạm vi vai trò không được để trống")
        @Pattern(regexp = "(?i)SYSTEM|BRANCH", message = "Phạm vi vai trò phải là SYSTEM hoặc BRANCH")
        private String scope;

        private List<String> permissionCodes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @NotBlank(message = "Tên vai trò không được để trống")
        @Size(max = 100, message = "Tên vai trò tối đa 100 ký tự")
        private String name;

        @Pattern(regexp = "(?i)SYSTEM|BRANCH", message = "Phạm vi vai trò phải là SYSTEM hoặc BRANCH")
        private String scope;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignPermissionsRequest {
        private List<String> permissionCodes;
        private List<Long> permissionIds;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private UUID uuid;
        private String code;
        private String name;
        private String scope;
        private LocalDateTime createAt;
        private LocalDateTime updateAt;
        private int permissionCount;
        private List<String> permissions;
    }
}
