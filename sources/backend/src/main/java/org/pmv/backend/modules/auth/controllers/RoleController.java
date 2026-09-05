package org.pmv.backend.modules.auth.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.pmv.backend.common.reponse.ApiResponse;
import org.pmv.backend.modules.auth.dtos.roles.RoleDto;
import org.pmv.backend.modules.auth.services.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<RoleDto.Response>>> getAll(
            @RequestParam(value = "scope", required = false) String scope
    ) {
        return ResponseEntity.ok(roleService.getAllRoles(scope));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse.Success<RoleDto.Response>> getById(
            @PathVariable("id") Long id
    ) {
        return ResponseEntity.ok(roleService.getRoleById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse.Success<RoleDto.Response>> getByCode(
            @PathVariable("code") String code
    ) {
        return ResponseEntity.ok(roleService.getRoleByCode(code));
    }

    @PostMapping
    public ResponseEntity<ApiResponse.Success<RoleDto.Response>> create(
            @Valid @RequestBody RoleDto.CreateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roleService.createRole(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse.Success<RoleDto.Response>> update(
            @PathVariable("id") Long id,
            @Valid @RequestBody RoleDto.UpdateRequest request
    ) {
        return ResponseEntity.ok(roleService.updateRole(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse.Success<Void>> delete(
            @PathVariable("id") Long id
    ) {
        return ResponseEntity.ok(roleService.deleteRole(id));
    }

    @GetMapping("/{id}/permissions")
    public ResponseEntity<ApiResponse.Success<List<String>>> getPermissions(
            @PathVariable("id") Long id
    ) {
        return ResponseEntity.ok(roleService.getRolePermissions(id));
    }

    @PostMapping("/{id}/permissions")
    public ResponseEntity<ApiResponse.Success<RoleDto.Response>> assignPermissions(
            @PathVariable("id") Long id,
            @RequestBody RoleDto.AssignPermissionsRequest request
    ) {
        return ResponseEntity.ok(roleService.assignPermissions(id, request));
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<ApiResponse.Success<RoleDto.Response>> updatePermissions(
            @PathVariable("id") Long id,
            @RequestBody RoleDto.AssignPermissionsRequest request
    ) {
        return ResponseEntity.ok(roleService.assignPermissions(id, request));
    }
}
