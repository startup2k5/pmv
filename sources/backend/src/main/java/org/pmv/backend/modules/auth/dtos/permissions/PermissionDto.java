package org.pmv.backend.modules.auth.dtos.permissions;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class PermissionDto {

    // ==========================================
    // 1. NGHIỆP VỤ THÊM MỚI (INSERT)
    // ==========================================
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "Mã quyền không được để trống")
        @Size(max = 100, message = "Mã quyền không vượt quá 100 ký tự")
        private String code;

        @NotBlank(message = "Tên quyền không được để trống")
        @Size(max = 100, message = "Tên quyền không vượt quá 100 ký tự")
        private String name;

        private Long parentId;

        @Pattern(regexp = "(?i)SYSTEM|BRANCH|ALL", message = "Phạm vi phải là SYSTEM, BRANCH hoặc ALL")
        private String scope;

        @Size(max = 20, message = "Hành động tối đa 20 ký tự")
        private String action;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateResponse {
        private Long id;
        private UUID uuid;
        private Long parentId;
        private String code;
        private String name;
        private String scope;
        private String action;
        private LocalDateTime createAt;
    }

    // ==========================================
    // 2. NGHIỆP VỤ CẬP NHẬT (UPDATE)
    // ==========================================
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @NotBlank(message = "Tên quyền không được để trống")
        @Size(max = 100, message = "Tên quyền không vượt quá 100 ký tự")
        private String name;

        private Long parentId;

        @Pattern(regexp = "(?i)SYSTEM|BRANCH|ALL", message = "Phạm vi phải là SYSTEM, BRANCH hoặc ALL")
        private String scope;

        @Size(max = 20, message = "Hành động tối đa 20 ký tự")
        private String action;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateResponse {
        private Long id;
        private UUID uuid;
        private Long parentId;
        private String code;
        private String name;
        private String scope;
        private String action;
        private LocalDateTime createAt;
    }

    // ==========================================
    // 3. NGHIỆP VỤ CÂY PHÂN QUYỀN (TREE)
    // ==========================================
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TreeResponse {
        private Long id;
        private UUID uuid;
        private Long parentId;
        private String code;
        private String name;
        private String scope;
        private String action;
        private LocalDateTime createAt;

        @Builder.Default
        private List<TreeResponse> children = new ArrayList<>();
    }

    // ==========================================
    // 4. DANH SÁCH / CHI TIẾT ĐƠN LẺ (ITEM)
    // ==========================================
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemResponse {
        private Long id;
        private UUID uuid;
        private Long parentId;
        private String code;
        private String name;
        private String scope;
        private String action;
        private LocalDateTime createAt;
    }
}
