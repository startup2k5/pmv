package org.pmv.backend.modules.me.services;

import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.pmv.backend.common.exception.AppException;
import org.pmv.backend.common.exception.ErrorCode;
import org.pmv.backend.common.jwt.JwtClaim;
import org.pmv.backend.common.jwt.JwtService;
import org.pmv.backend.common.reponse.ApiResponse;
import org.pmv.backend.modules.me.dtos.MeDto;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@AllArgsConstructor
public class MeService {

    private final JwtService jwtService;

    /**
     * Lấy toàn bộ thông tin tài khoản và danh sách quyền trực tiếp từ Claims của Token
     */
    public ApiResponse.Success<MeDto.Response> getMeFromToken(String token) {
        try {
            Claims claims = jwtService.parse(token);

            String idStr = claims.get(JwtClaim.USERID, String.class);
            Long id = idStr != null ? Long.parseLong(idStr) : Long.parseLong(claims.getSubject());
            String uuidStr = claims.get(JwtClaim.UUID, String.class);
            String username = claims.get(JwtClaim.USERNAME, String.class);
            String roleCode = claims.get(JwtClaim.ROLECODE, String.class);
            String branchIdStr = claims.get(JwtClaim.BRANCH_ID, String.class);

            @SuppressWarnings("unchecked")
            List<String> permissions = claims.get(JwtClaim.PERMISSIONS, List.class);

            MeDto.Response response = MeDto.Response.builder()
                    .id(id)
                    .uuid(uuidStr != null ? UUID.fromString(uuidStr) : null)
                    .username(username)
                    .roleCode(roleCode)
                    .branchId(branchIdStr != null ? Long.parseLong(branchIdStr) : null)
                    .permissions(permissions != null ? permissions : Collections.emptyList())
                    .build();

            return ApiResponse.Success.ok("Lay thong tin tai khoan tu token thanh cong", response);
        } catch (Exception e) {
            log.error("Khong the doc claim tu token: {}", e.getMessage());
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
    }
}
