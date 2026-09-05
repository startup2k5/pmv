package org.pmv.backend.modules.auth.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.pmv.backend.common.reponse.ApiResponse;
import org.pmv.backend.modules.auth.dtos.permissions.PermissionDto;
import org.pmv.backend.modules.auth.services.PermissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<PermissionDto.TreeResponse>>> getAll(
            @RequestParam(value = "scope", required = false) String scope,
            @RequestParam(value = "roleId", required = false) Long roleId
    ) {
        return ResponseEntity.ok(permissionService.getPermissionTree(scope, roleId));
    }

    @GetMapping("/tree")
    public ResponseEntity<ApiResponse.Success<List<PermissionDto.TreeResponse>>> getTree(
            @RequestParam(value = "scope", required = false) String scope,
            @RequestParam(value = "roleId", required = false) Long roleId
    ) {
        return ResponseEntity.ok(permissionService.getPermissionTree(scope, roleId));
    }

    @GetMapping("/flat")
    public ResponseEntity<ApiResponse.Success<List<PermissionDto.ItemResponse>>> getFlat() {
        return ResponseEntity.ok(permissionService.getAll());
    }

    @PostMapping
    public ResponseEntity<ApiResponse.Success<PermissionDto.CreateResponse>> create(
            @Valid @RequestBody PermissionDto.CreateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(permissionService.create(request));
    }

    @PutMapping("/{code}")
    public ResponseEntity<ApiResponse.Success<PermissionDto.UpdateResponse>> update(
            @PathVariable("code") String code,
            @Valid @RequestBody PermissionDto.UpdateRequest request
    ) {
        return ResponseEntity.ok(permissionService.update(code, request));
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<ApiResponse.Success<Void>> delete(
            @PathVariable("code") String code
    ) {
        return ResponseEntity.ok(permissionService.delete(code));
    }
}
