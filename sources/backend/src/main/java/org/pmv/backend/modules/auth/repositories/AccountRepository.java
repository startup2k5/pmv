package org.pmv.backend.modules.auth.repositories;


import org.pmv.backend.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    /**
     * Tim kiem tai khoan qua username
     *
     * @param username Ten dang nhap
     * @return Optional
     */
    Optional<Account> findByUsername(String username);

    /**
     * Kiem tra tai khoan ton tai hay chua
     *
     * @param username Ten dang nhap
     * @return boolean
     */
    boolean existsByUsername(String username);

    /**
     * Cap nhat mat khau theo username
     *
     * @param new_password Mat khau moi
     * @param username Ten dang nhap
     * @return int
     */
    @Modifying
    @Transactional
    @Query(value = "UPDATE auth.accounts SET password = :new_password WHERE username = :username", nativeQuery = true)
    int updatePassword(
            @Param("new_password") String new_password,
            @Param("username") String username
    );
}