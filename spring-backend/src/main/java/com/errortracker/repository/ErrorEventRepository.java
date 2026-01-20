package com.errortracker.repository;

import com.errortracker.entity.ErrorEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ErrorEventRepository extends JpaRepository<ErrorEvent, Integer> {
    List<ErrorEvent> findByProjectId(Integer projectId);
    
    @Query("SELECT e FROM ErrorEvent e WHERE e.projectId = :projectId " +
           "AND (:status IS NULL OR e.status = :status) " +
           "AND (:severity IS NULL OR e.severity = :severity) " +
           "AND (:type IS NULL OR e.type = :type) " +
           "AND (:search IS NULL OR LOWER(e.message) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(e.stackTrace) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(e.userName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(e.traceId) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY e.createdAt DESC")
    List<ErrorEvent> findByProjectIdWithFilters(
        @Param("projectId") Integer projectId,
        @Param("status") String status,
        @Param("severity") String severity,
        @Param("type") String type,
        @Param("search") String search
    );

}
