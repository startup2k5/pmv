package org.pmv.backend.modules.auth.repositories;

import org.pmv.backend.entities.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {

    /**
     * Lay cay phan quyen theo scope tu PostgreSQL function
     *
     * @param scope Pham vi quyen (SYSTEM, BRANCH, ALL hoac null de lay toan bo)
     * @return String Chuoi JSON chua system.response va cay phan quyen
     */
    @Query(value = "SELECT auth.fn_get_permission_tree(CAST(:scope AS VARCHAR))::text", nativeQuery = true)
    String getPermissionTreeByScopeNativeJson(@Param("scope") String scope);

    /**
     * Lay cay phan quyen theo role id tu PostgreSQL function
     *
     * @param roleId ID cua vai tro
     * @return String Chuoi JSON chua system.response va cay phan quyen
     */
    @Query(value = "SELECT auth.fn_get_permission_tree_by_role(:roleId)::text", nativeQuery = true)
    String getPermissionTreeByRoleNativeJson(@Param("roleId") Long roleId);

    /**
     * Lay danh sach ma quyen theo tap hop scopes
     *
     * @param scopes Tap hop cac pham vi quyen
     * @return List<String> Danh sach ma quyen
     */
    @Query("SELECT p.code FROM Permission p WHERE p.scope IN :scopes ORDER BY p.code ASC")
    List<String> findCodesByScopeIn(@Param("scopes") java.util.Collection<String> scopes);

    /**
     * Lay danh sach ma quyen hop le cho nhan vien theo roleId va scope
     *
     * @param roleId ID cua vai tro
     * @param scope Pham vi vai tro
     * @return List<String> Danh sach ma quyen
     */
    @Query("SELECT p.code FROM Permission p WHERE p.scope = 'ALL' " +
           "OR (p.scope = :scope AND p.id IN (SELECT rp.permission.id FROM RolePermission rp WHERE rp.role.id = :roleId)) " +
           "ORDER BY p.code ASC")
    List<String> findAllowedCodesForStaff(@Param("roleId") Long roleId, @Param("scope") String scope);

    /**
     * Kiem tra su ton tai cua quyen theo ma code
     *
     * @param code Ma dinh danh quyen
     * @return boolean True neu da ton tai
     */
    boolean existsByCode(String code);

    /**
     * Tim kiem chi tiet quyen theo ma code
     *
     * @param code Ma dinh danh quyen
     * @return Optional<Permission>
     */
    Optional<Permission> findByCode(String code);

    /**
     * Tim danh sach quyen theo tap hop ma code
     *
     * @param codes Tap hop cac ma code
     * @return List<Permission>
     */
    List<Permission> findByCodeIn(java.util.Collection<String> codes);

    /**
     * Xoa quyen theo ma code
     *
     * @param code Ma dinh danh quyen
     */
    void deleteByCode(String code);
}
