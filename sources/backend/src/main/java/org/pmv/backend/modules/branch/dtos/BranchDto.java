package org.pmv.backend.modules.branch.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

public class BranchDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private Long companyId;

        @NotBlank(message = "Tên chi nhánh không được để trống")
        @Size(max = 255, message = "Tên chi nhánh tối đa 255 ký tự")
        private String name;

        @Size(max = 255, message = "Địa chỉ tối đa 255 ký tự")
        private String address;

        @NotBlank(message = "Mã số thuế không được để trống")
        @Size(max = 20, message = "Mã số thuế tối đa 20 ký tự")
        private String taxCode;

        private Boolean isHeadquarter;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @NotBlank(message = "Tên chi nhánh không được để trống")
        @Size(max = 255, message = "Tên chi nhánh tối đa 255 ký tự")
        private String name;

        @Size(max = 255, message = "Địa chỉ tối đa 255 ký tự")
        private String address;

        @NotBlank(message = "Mã số thuế không được để trống")
        @Size(max = 20, message = "Mã số thuế tối đa 20 ký tự")
        private String taxCode;

        private Boolean isHeadquarter;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private UUID uuid;
        private Long companyId;
        private String companyName;
        private String name;
        private String address;
        private String taxCode;
        private Boolean isHeadquarter;
        private Long createById;
        private String createByUsername;
        private LocalDateTime createAt;
        private LocalDateTime updateAt;
    }
}
