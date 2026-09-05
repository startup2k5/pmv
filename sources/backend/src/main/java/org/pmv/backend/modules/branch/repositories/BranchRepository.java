package org.pmv.backend.modules.branch.repositories;

import org.pmv.backend.entities.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

    /**
     * Kiem tra ma so thue da ton tai hay chua
     *
     * @param taxCode Ma so thue
     * @return boolean True neu da ton tai
     */
    boolean existsByTaxCode(String taxCode);

    /**
     * Kiem tra ma so thue da ton tai cho chi nhanh khac (loai tru id hien tai)
     *
     * @param taxCode Ma so thue
     * @param id ID chi nhanh can loai tru
     * @return boolean True neu da ton tai
     */
    boolean existsByTaxCodeAndIdNot(String taxCode, Long id);

    /**
     * Tim kiem chi nhanh theo UUID
     *
     * @param uuid UUID chi nhanh
     * @return Optional<Branch>
     */
    Optional<Branch> findByUuid(UUID uuid);

    /**
     * Lay danh sach chi nhanh theo cong ty sap xep giam dan theo thoi gian tao
     *
     * @param companyId ID cong ty
     * @return List<Branch>
     */
    List<Branch> findByCompanyIdOrderByCreateAtDesc(Long companyId);

    /**
     * Lay tat ca chi nhanh sap xep giam dan theo thoi gian tao
     *
     * @return List<Branch>
     */
    List<Branch> findAllByOrderByCreateAtDesc();
}
