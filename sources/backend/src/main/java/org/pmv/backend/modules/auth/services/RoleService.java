package org.pmv.backend.modules.auth.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.pmv.backend.common.exception.AppException;
import org.pmv.backend.common.exception.ErrorCode;
import org.pmv.backend.common.reponse.ApiResponse;
import org.pmv.backend.entities.Permission;
import org.pmv.backend.entities.Role;
import org.pmv.backend.entities.RolePermission;
import org.pmv.backend.modules.auth.dtos.roles.RoleDto;
import org.pmv.backend.modules.auth.repositories.PermissionRepository;
import org.pmv.backend.modules.auth.repositories.RolePermissionRepository;
import org.pmv.backend.modules.auth.repositories.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final PermissionRepository permissionRepository;

    @Transactional(readOnly = true)
    public ApiResponse.Success<List<RoleDto.Response>> getAllRoles(String scope) {
        List<Role> roles;
        if (scope != null && !scope.isBlank()) {
            roles = roleRepository.findByScopeOrderByCreateAtDesc(scope.trim().toUpperCase());
        } else {
            roles = roleRepository.findAllByOrderByCreateAtDesc();
        }

        List<RoleDto.Response> responses = roles.stream().map(this::toResponse).toList();
        return ApiResponse.Success.ok("Lấy danh sách vai trò thành công", responses);
    }

    @Transactional(readOnly = true)
    public ApiResponse.Success<RoleDto.Response> getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOTFOUND));
        return ApiResponse.Success.ok("Lấy thông tin vai trò thành công", toResponse(role));
    }

    @Transactional(readOnly = true)
    public ApiResponse.Success<RoleDto.Response> getRoleByCode(String code) {
        Role role = roleRepository.findByCode(code.trim().toUpperCase())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOTFOUND));
        return ApiResponse.Success.ok("Lấy thông tin vai trò thành công", toResponse(role));
    }

    @Transactional
    public ApiResponse.Success<RoleDto.Response> createRole(RoleDto.CreateRequest request) {
        String code = request.getCode().trim().toUpperCase();
        if (roleRepository.existsByCode(code)) {
            throw new AppException(ErrorCode.ROLE_EXISTS);
        }

        Role role = new Role();
        role.setCode(code);
        role.setName(request.getName().trim());
        role.setScope(request.getScope() != null ? request.getScope().trim().toUpperCase() : "BRANCH");

        Role savedRole = roleRepository.save(role);

        if (request.getPermissionCodes() != null && !request.getPermissionCodes().isEmpty()) {
            assignPermissionsInternal(savedRole, request.getPermissionCodes(), Collections.emptyList());
        }

        return ApiResponse.Success.ok("Tạo vai trò thành công", toResponse(savedRole));
    }

    @Transactional
    public ApiResponse.Success<RoleDto.Response> updateRole(Long id, RoleDto.UpdateRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOTFOUND));

        role.setName(request.getName().trim());
        if (request.getScope() != null && !request.getScope().isBlank()) {
            role.setScope(request.getScope().trim().toUpperCase());
        }

        Role updatedRole = roleRepository.save(role);
        return ApiResponse.Success.ok("Cập nhật vai trò thành công", toResponse(updatedRole));
    }

    @Transactional
    public ApiResponse.Success<Void> deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOTFOUND));

        if ("SYSTEM_ADMIN".equalsIgnoreCase(role.getCode())) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        rolePermissionRepository.deleteByRoleId(id);
        roleRepository.delete(role);
        return ApiResponse.Success.ok("Xóa vai trò thành công", null);
    }

    @Transactional(readOnly = true)
    public ApiResponse.Success<List<String>> getRolePermissions(Long roleId) {
        if (!roleRepository.existsById(roleId)) {
            throw new AppException(ErrorCode.ROLE_NOTFOUND);
        }
        List<String> permissionCodes = rolePermissionRepository.findPermissionCodesByRoleId(roleId);
        return ApiResponse.Success.ok("Lấy danh sách quyền của vai trò thành công", permissionCodes);
    }

    @Transactional
    public ApiResponse.Success<RoleDto.Response> assignPermissions(Long roleId, RoleDto.AssignPermissionsRequest request) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOTFOUND));

        assignPermissionsInternal(role, request.getPermissionCodes(), request.getPermissionIds());

        return ApiResponse.Success.ok("Phân quyền cho vai trò thành công", toResponse(role));
    }

    private void assignPermissionsInternal(Role role, List<String> permissionCodes, List<Long> permissionIds) {
        rolePermissionRepository.deleteByRoleId(role.getId());

        Set<Permission> targetPermissions = new LinkedHashSet<>();

        if (permissionCodes != null && !permissionCodes.isEmpty()) {
            List<String> cleanCodes = permissionCodes.stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .map(String::toUpperCase)
                    .filter(s -> !s.isEmpty())
                    .toList();
            if (!cleanCodes.isEmpty()) {
                targetPermissions.addAll(permissionRepository.findByCodeIn(cleanCodes));
            }
        }

        if (permissionIds != null && !permissionIds.isEmpty()) {
            List<Long> cleanIds = permissionIds.stream().filter(Objects::nonNull).toList();
            if (!cleanIds.isEmpty()) {
                targetPermissions.addAll(permissionRepository.findAllById(cleanIds));
            }
        }

        List<RolePermission> rolePermissions = targetPermissions.stream().map(perm -> {
            RolePermission rp = new RolePermission();
            rp.setRole(role);
            rp.setPermission(perm);
            return rp;
        }).toList();

        rolePermissionRepository.saveAll(rolePermissions);
    }

    private RoleDto.Response toResponse(Role role) {
        List<String> permissionCodes = rolePermissionRepository.findPermissionCodesByRoleId(role.getId());
        return RoleDto.Response.builder()
                .id(role.getId())
                .uuid(role.getUuid())
                .code(role.getCode())
                .name(role.getName())
                .scope(role.getScope())
                .createAt(role.getCreateAt())
                .updateAt(role.getUpdateAt())
                .permissionCount(permissionCodes.size())
                .permissions(permissionCodes)
                .build();
    }
}
