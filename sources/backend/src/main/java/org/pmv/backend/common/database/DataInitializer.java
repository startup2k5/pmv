package org.pmv.backend.common.database;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.pmv.backend.modules.auth.repositories.AccountRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class DataInitializer {
    private static final String ADMIN_USERNAME = "sysadmin";
    private static final String ADMIN_PASSWORD = "admin";

    private final PasswordEncoder passwordEncoder;
    private final AccountRepository accountRepository;
    private final InitDataHistoryRepository initDataHistoryRepository;

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            checkDataInitHistory(
                    "UPDATE_PASS_ADMIN",
                    "Cap nhat mat khau tai khoan admin",
                    this::updatePasswordAccount
            );
        };
    }

    private void checkDataInitHistory(String key, String description, Runnable task) {
        try {
            if (initDataHistoryRepository.existsByCode(key)) {
                log.info("Lich su khoi tao du lieu voi ma [{}] da ton tai, bo qua.", key);
                return;
            }

            log.info("Bat dau khoi tao du lieu cho ma [{}]...", key);
            task.run();

            initDataHistoryRepository.insertHistory(
                    key,
                    description != null ? description : "Khoi tao du lieu: " + key
            );

            log.info("Khoi tao du lieu cho ma [{}] thanh cong va da ghi nhan lich su.", key);
        } catch (Exception e) {
            log.error("Loi khi khoi tao du lieu cho ma [{}]: {}", key, e.getMessage(), e);
        }
    }


}
