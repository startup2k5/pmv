package org.pmv.backend.common.database;

import org.pmv.backend.entities.InitDataHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface InitDataHistoryRepository extends JpaRepository<InitDataHistory, Long> {

    /**
     * Kiem tra xem ma khoi tao du lieu da ton tai hay chua
     *
     * @param code Ma dinh danh khoi tao
     * @return true neu da ton tai, nguoc lai false
     */
    boolean existsByCode(String code);

    /**
     * Them ban ghi lich su khoi tao du lieu bang native query.
     *
     * @param code        Ma khoi tao
     * @param description Mo ta khoi tao
     */
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO public.init_data_history (code, description) VALUES (:code, :description)", nativeQuery = true)
    void insertHistory(@Param("code") String code, @Param("description") String description);
}
