package org.pmv.backend.modules.auth.repositories;

import org.pmv.backend.entities.Permission;
import org.pmv.backend.entities.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {

    /**
     * Lay danh sach phan quyen cua vai tro theo roleId
     *
     * @param roleId ID vai tro
     * @return List<RolePermission>
     */
    List<RolePermission> findByRoleId(Long roleId);

    /**
     * Lay danh sach entity Permission da duoc gan cho vai tro
     *
     * @param roleId ID vai tro
     * @return List<Permission>
     */
    @Query("SELECT rp.permission FROM RolePermission rp WHERE rp.role.id = :roleId ORDER BY rp.permission.code ASC")
    List<Permission> findPermissionsByRoleId(@Param("roleId") Long roleId);

    /**
     * Lay danh sach ma permission code da duoc gan cho vai tro
     *
     * @param roleId ID vai tro
     * @return List<String>
     */
    @Query("SELECT rp.permission.code FROM RolePermission rp WHERE rp.role.id = :roleId ORDER BY rp.permission.code ASC")
    List<String> findPermissionCodesByRoleId(@Param("roleId") Long roleId);

    /**
     * Xoa toan bo phan quyen gan voi vai tro
     *
     * @param roleId ID vai tro
     */
    @Modifying
    @Query("DELETE FROM RolePermission rp WHERE rp.role.id = :roleId")
    void deleteByRoleId(@Param("roleId") Long roleId);

}
