package org.pmv.backend.modules.auth.repositories;


import org.pmv.backend.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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


}