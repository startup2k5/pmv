package org.pmv.backend.modules.acccount.repositories;

import org.pmv.backend.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    /**
     * Tim kiem tai khoan quan uuid tai khoan
     * @param uuid ma tai khoan
     * @return Account
     */
    Optional<Account> findByUuid(UUID uuid);

    /**
     * Tim kiem tai khoan theo username
     * @param username ten dang nhap
     */
    Optional<Account> findByUsername(String username);

    /**
     * Check tai khoan ton tai
     * @param username ten dang nhap
     * return boolean
     */
    boolean existsByUsername(String username);
}
