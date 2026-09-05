package org.pmv.backend.modules.branch.repositories;

import org.pmv.backend.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    /**
     * Lay ban ghi cong ty dau tien sap xep theo ID tang dan
     *
     * @return Optional<Company>
     */
    Optional<Company> findFirst();
}
