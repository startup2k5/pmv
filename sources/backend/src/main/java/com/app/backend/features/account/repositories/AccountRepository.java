package com.app.backend.features.account.repositories;

import com.app.backend.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AccountRepository extends JpaRepository<Account, Long> {

    /**
     * Check if the user already exists
     *
     * @param username Username of the account
     * return boolean
     */
    boolean existsByUsername(String username);

    /**
     * Creates a new account for a user and assigns it to a specific company,
     * branch, and role.
     *
     * @param companyId ID of the company associated with the account
     * @param branchId ID of the branch associated with the account
     * @param roleId ID of the role assigned to the account
     *
     * @param username Username used to log in
     * @param password Password used to authenticate the account
     *
     * @param name Full name of the account
     * @param address Address of the account
     */
    @Query(value = "SELECT 1", nativeQuery = true)
    String findByUsername(
            @Param("companyId") Long companyId,
            @Param("branchId") Long branchId,
            @Param("roleId") Long roleId,
            @Param("username")  String username,
            @Param("password") String password,
            @Param("name") String name,
            @Param("address") String address
    );
}
