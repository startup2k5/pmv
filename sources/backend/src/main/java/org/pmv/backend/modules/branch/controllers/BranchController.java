package org.pmv.backend.modules.branch.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.pmv.backend.common.reponse.ApiResponse;
import org.pmv.backend.modules.branch.dtos.BranchDto;
import org.pmv.backend.modules.branch.services.BranchService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/branches")
@RequiredArgsConstructor
public class BranchController {

    private final BranchService branchService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<BranchDto.Response>>> getAll(
            @RequestParam(value = "companyId", required = false) Long companyId
    ) {
        return ResponseEntity.ok(branchService.getAllBranches(companyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse.Success<BranchDto.Response>> getById(
            @PathVariable("id") Long id
    ) {
        return ResponseEntity.ok(branchService.getBranchById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse.Success<BranchDto.Response>> create(
            @Valid @RequestBody BranchDto.CreateRequest request
    ) {
        Long currentUserId = extractUserId();
        return ResponseEntity.status(HttpStatus.CREATED).body(branchService.createBranch(request, currentUserId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse.Success<BranchDto.Response>> update(
            @PathVariable("id") Long id,
            @Valid @RequestBody BranchDto.UpdateRequest request
    ) {
        Long currentUserId = extractUserId();
        return ResponseEntity.ok(branchService.updateBranch(id, request, currentUserId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse.Success<Void>> delete(
            @PathVariable("id") Long id
    ) {
        return ResponseEntity.ok(branchService.deleteBranch(id));
    }

    private Long extractUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() != null) {
                return Long.parseLong(authentication.getPrincipal().toString());
            }
        } catch (Exception ignored) {
        }
        return null;
    }
}
