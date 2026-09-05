package org.pmv.backend.modules.auth.repositories;

import org.pmv.backend.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    /**
     * Kiem tra vai tro ton tai theo ma code
     *
     * @param code Ma dinh danh vai tro
     * @return boolean True neu ton tai
     */
    boolean existsByCode(String code);

    /**
     * Tim kiem vai tro theo ma code
     *
     * @param code Ma dinh danh vai tro
     * @return Optional<Role>
     */
    Optional<Role> findByCode(String code);

    /**
     * Lay danh sach vai tro theo scope, sap xep giam dan theo thoi gian tao
     *
     * @param scope Pham vi vai tro (SYSTEM, BRANCH)
     * @return List<Role>
     */
    List<Role> findByScopeOrderByCreateAtDesc(String scope);

    /**
     * Lay tat ca vai tro sap xep giam dan theo thoi gian tao
     *
     * @return List<Role>
     */
    List<Role> findAllByOrderByCreateAtDesc();
}
