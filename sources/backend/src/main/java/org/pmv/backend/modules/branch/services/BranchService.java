package org.pmv.backend.modules.branch.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.pmv.backend.common.exception.AppException;
import org.pmv.backend.common.exception.ErrorCode;
import org.pmv.backend.common.reponse.ApiResponse;
import org.pmv.backend.entities.Account;
import org.pmv.backend.entities.Branch;
import org.pmv.backend.entities.Company;
import org.pmv.backend.modules.auth.repositories.AccountRepository;
import org.pmv.backend.modules.branch.dtos.BranchDto;
import org.pmv.backend.modules.branch.repositories.BranchRepository;
import org.pmv.backend.modules.branch.repositories.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BranchService {

    private final BranchRepository branchRepository;
    private final CompanyRepository companyRepository;
    private final AccountRepository accountRepository;

    @Transactional(readOnly = true)
    public ApiResponse.Success<List<BranchDto.Response>> getAllBranches(Long companyId) {
        List<Branch> branches;
        if (companyId != null) {
            branches = branchRepository.findByCompanyIdOrderByCreateAtDesc(companyId);
        } else {
            branches = branchRepository.findAllByOrderByCreateAtDesc();
        }

        List<BranchDto.Response> responses = branches.stream().map(this::toResponse).toList();
        return ApiResponse.Success.ok("Lấy danh sách chi nhánh thành công", responses);
    }

    @Transactional(readOnly = true)
    public ApiResponse.Success<BranchDto.Response> getBranchById(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOTFOUND));
        return ApiResponse.Success.ok("Lấy thông tin chi nhánh thành công", toResponse(branch));
    }

    @Transactional
    public ApiResponse.Success<BranchDto.Response> createBranch(BranchDto.CreateRequest request, Long currentUserId) {
        String taxCode = request.getTaxCode().trim();
        if (branchRepository.existsByTaxCode(taxCode)) {
            throw new AppException(ErrorCode.BRANCH_EXISTS);
        }

        Company company;
        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new AppException(ErrorCode.COMPANY_NOTFOUND));
        } else {
            company = companyRepository.findFirst()
                    .orElseThrow(() -> new AppException(ErrorCode.COMPANY_NOTFOUND));
        }

        Account currentUser = null;
        if (currentUserId != null) {
            currentUser = accountRepository.findById(currentUserId).orElse(null);
        }

        Branch branch = new Branch();
        branch.setCompany(company);
        branch.setName(request.getName().trim());
        branch.setAddress(request.getAddress() != null ? request.getAddress().trim() : "");
        branch.setTaxCode(taxCode);
        branch.setCreateBy(currentUser);
        branch.setUpdateBy(currentUser);

        Branch savedBranch = branchRepository.save(branch);
        return ApiResponse.Success.ok("Tạo chi nhánh thành công", toResponse(savedBranch));
    }

    @Transactional
    public ApiResponse.Success<BranchDto.Response> updateBranch(Long id, BranchDto.UpdateRequest request, Long currentUserId) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOTFOUND));

        String taxCode = request.getTaxCode().trim();
        if (branchRepository.existsByTaxCodeAndIdNot(taxCode, id)) {
            throw new AppException(ErrorCode.BRANCH_EXISTS);
        }

        Account currentUser = null;
        if (currentUserId != null) {
            currentUser = accountRepository.findById(currentUserId).orElse(null);
        }

        branch.setName(request.getName().trim());
        branch.setAddress(request.getAddress() != null ? request.getAddress().trim() : "");
        branch.setTaxCode(taxCode);
        if (currentUser != null) {
            branch.setUpdateBy(currentUser);
        }

        Branch updatedBranch = branchRepository.save(branch);
        return ApiResponse.Success.ok("Cập nhật chi nhánh thành công", toResponse(updatedBranch));
    }

    @Transactional
    public ApiResponse.Success<Void> deleteBranch(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOTFOUND));

        branchRepository.delete(branch);
        return ApiResponse.Success.ok("Xóa chi nhánh thành công", null);
    }

    private BranchDto.Response toResponse(Branch branch) {
        return BranchDto.Response.builder()
                .id(branch.getId())
                .uuid(branch.getUuid())
                .companyId(branch.getCompany() != null ? branch.getCompany().getId() : null)
                .companyName(branch.getCompany() != null ? branch.getCompany().getName() : null)
                .name(branch.getName())
                .address(branch.getAddress())
                .taxCode(branch.getTaxCode())
                .createById(branch.getCreateBy() != null ? branch.getCreateBy().getId() : null)
                .createByUsername(branch.getCreateBy() != null ? branch.getCreateBy().getUsername() : null)
                .createAt(branch.getCreateAt())
                .updateAt(branch.getUpdateAt())
                .build();
    }
}
