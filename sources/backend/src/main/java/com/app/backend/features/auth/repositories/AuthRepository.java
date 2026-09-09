package com.app.backend.features.auth.repositories;

import com.app.backend.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepository extends JpaRepository<Account, Long> {
    /**
     * find account by username
     *
     * @param username Username by user post
     * return Account
     */
    Optional<Account> findByUsername(String username);


}
