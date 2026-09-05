package org.pmv.backend.modules.auth.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.pmv.backend.common.exception.AppException;
import org.pmv.backend.common.exception.ErrorCode;
import org.pmv.backend.common.reponse.ApiResponse;
import org.pmv.backend.common.reponse.SqlResponse;
import org.pmv.backend.entities.Permission;
import org.pmv.backend.modules.auth.dtos.permissions.PermissionDto;
import org.pmv.backend.modules.auth.repositories.PermissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final ObjectMapper objectMapper;

    /**
     * Lay cay phan quyen theo scope hoac roleId truc tiep tu PostgreSQL function tra ve system.response
     */
    @Transactional(readOnly = true)
    public ApiResponse.Success<List<PermissionDto.TreeResponse>> getPermissionTree(String scope, Long roleId) {
        String json;
        if (roleId != null) {
            json = permissionRepository.getPermissionTreeByRoleNativeJson(roleId);
        } else {
            String trimmedScope = (scope != null && !scope.isBlank()) ? scope.trim().toUpperCase() : null;
            json = permissionRepository.getPermissionTreeByScopeNativeJson(trimmedScope);
        }

        if (json == null || json.isBlank()) {
            return ApiResponse.Success.ok("Lay danh sach cay phan quyen thanh cong", Collections.emptyList());
        }

        try {
            SqlResponse<List<PermissionDto.TreeResponse>> sqlResponse = objectMapper.readValue(
                    json,
                    new TypeReference<SqlResponse<List<PermissionDto.TreeResponse>>>() {}
            );

            if (Boolean.FALSE.equals(sqlResponse.getSuccess())) {
                log.warn("SQL system.response error: [{}] {}", sqlResponse.getErrors(), sqlResponse.getMsg());
                throw new AppException(ErrorCode.INTERNAL_ERROR);
            }

            return ApiResponse.Success.ok(
                    sqlResponse.getMsg() != null ? sqlResponse.getMsg() : "Lay danh sach cay phan quyen thanh cong",
                    sqlResponse.getData() != null ? sqlResponse.getData() : Collections.emptyList()
            );
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("Loi khi parse tree tu SQL JSON function: {}", e.getMessage(), e);
            throw new AppException(ErrorCode.DATABASE_ERROR);
        }
    }

    /**
     * Lay toan bo danh sach phan quyen sap xep theo code
     */
    @Transactional(readOnly = true)
    public ApiResponse.Success<List<PermissionDto.ItemResponse>> getAll() {
        List<Permission> list = permissionRepository.findAll();
        List<PermissionDto.ItemResponse> responseList = list.stream()
                .map(this::toItemResponse)
                .toList();
        return ApiResponse.Success.ok("Lay danh sach quyen thanh cong", responseList);
    }

    /**
     * Tao moi quyen (Insert)
     */
    @Transactional
    public ApiResponse.Success<PermissionDto.CreateResponse> create(PermissionDto.CreateRequest request) {
        String code = request.getCode().trim().toUpperCase();
        if (permissionRepository.existsByCode(code)) {
            throw new AppException(ErrorCode.PERMISSION_EXISTS);
        }

        Permission permission = new Permission();
        permission.setCode(code);
        permission.setName(request.getName().trim());
        permission.setScope(request.getScope() != null ? request.getScope().trim().toUpperCase() : "BRANCH");
        permission.setAction(request.getAction() != null ? request.getAction().trim().toUpperCase() : null);

        if (request.getParentId() != null) {
            Permission parent = permissionRepository.findById(request.getParentId())
                    .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOTFOUND));
            permission.setParent(parent);
        }

        Permission saved = permissionRepository.save(permission);
        return ApiResponse.Success.ok("Tao quyen thanh cong", toCreateResponse(saved));
    }

    /**
     * Cap nhat quyen (Update)
     */
    @Transactional
    public ApiResponse.Success<PermissionDto.UpdateResponse> update(String code, PermissionDto.UpdateRequest request) {
        String upperCode = code.trim().toUpperCase();
        Permission permission = permissionRepository.findByCode(upperCode)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOTFOUND));

        permission.setName(request.getName().trim());
        if (request.getScope() != null && !request.getScope().isBlank()) {
            permission.setScope(request.getScope().trim().toUpperCase());
        }
        permission.setAction(request.getAction() != null && !request.getAction().isBlank()
                ? request.getAction().trim().toUpperCase() : null);

        if (request.getParentId() != null) {
            Long parentId = request.getParentId();
            if (permission.getId().equals(parentId)) {
                throw new AppException(ErrorCode.INVALID_INPUT);
            }
            Permission parent = permissionRepository.findById(parentId)
                    .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOTFOUND));

            // Prevent circular reference in parent chain
            Permission current = parent;
            Set<Long> visited = new HashSet<>();
            visited.add(permission.getId());
            while (current != null) {
                if (visited.contains(current.getId())) {
                    throw new AppException(ErrorCode.INVALID_INPUT);
                }
                visited.add(current.getId());
                current = current.getParent();
            }
            permission.setParent(parent);
        } else {
            permission.setParent(null);
        }

        Permission updated = permissionRepository.save(permission);
        return ApiResponse.Success.ok("Cap nhat quyen thanh cong", toUpdateResponse(updated));
    }

    /**
     * Xoa quyen truc tiep
     */
    @Transactional
    public ApiResponse.Success<Void> delete(String code) {
        String upperCode = code.trim().toUpperCase();
        if (!permissionRepository.existsByCode(upperCode)) {
            throw new AppException(ErrorCode.PERMISSION_NOTFOUND);
        }

        permissionRepository.deleteByCode(upperCode);
        return ApiResponse.Success.ok("Xoa quyen thanh cong", null);
    }

    private PermissionDto.CreateResponse toCreateResponse(Permission p) {
        return PermissionDto.CreateResponse.builder()
                .id(p.getId())
                .uuid(p.getUuid())
                .parentId(p.getParent() != null ? p.getParent().getId() : null)
                .code(p.getCode())
                .name(p.getName())
                .scope(p.getScope())
                .action(p.getAction())
                .createAt(p.getCreateAt())
                .build();
    }

    private PermissionDto.UpdateResponse toUpdateResponse(Permission p) {
        return PermissionDto.UpdateResponse.builder()
                .id(p.getId())
                .uuid(p.getUuid())
                .parentId(p.getParent() != null ? p.getParent().getId() : null)
                .code(p.getCode())
                .name(p.getName())
                .scope(p.getScope())
                .action(p.getAction())
                .createAt(p.getCreateAt())
                .build();
    }

    private PermissionDto.ItemResponse toItemResponse(Permission p) {
        return PermissionDto.ItemResponse.builder()
                .id(p.getId())
                .uuid(p.getUuid())
                .parentId(p.getParent() != null ? p.getParent().getId() : null)
                .code(p.getCode())
                .name(p.getName())
                .scope(p.getScope())
                .action(p.getAction())
                .createAt(p.getCreateAt())
                .build();
    }
}
