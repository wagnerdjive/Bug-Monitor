package com.errortracker.repository;

import com.errortracker.entity.ErrorEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ErrorEventRepository extends JpaRepository<ErrorEvent, Integer> {
    List<ErrorEvent> findByProjectId(Integer projectId);
    
    long countByProjectId(Integer projectId);
    
    @Query("SELECT COUNT(DISTINCT e.userName) FROM ErrorEvent e WHERE e.projectId = :projectId AND e.userName IS NOT NULL")
    long countDistinctUsersByProjectId(@Param("projectId") Integer projectId);
    
    long countByProjectIdAndCreatedAtAfter(Integer projectId, LocalDateTime since);
    
    @Query("SELECT COUNT(DISTINCT e.userName) FROM ErrorEvent e WHERE e.projectId = :projectId AND e.createdAt > :since AND e.userName IS NOT NULL")
    long countDistinctUsersByProjectIdAndCreatedAtAfter(@Param("projectId") Integer projectId, @Param("since") LocalDateTime since);
    
    @Query(value = "SELECT * FROM error_events WHERE project_id = :projectId " +
           "AND (:status IS NULL OR status = :status) " +
           "AND (:severity IS NULL OR severity = :severity) " +
           "AND (:type IS NULL OR type = :type) " +
           "AND (:search IS NULL OR LOWER(message::text) LIKE LOWER('%' || :search || '%') " +
           "OR LOWER(stack_trace::text) LIKE LOWER('%' || :search || '%') " +
           "OR LOWER(user_name::text) LIKE LOWER('%' || :search || '%') " +
           "OR LOWER(trace_id::text) LIKE LOWER('%' || :search || '%')) " +
           "ORDER BY created_at DESC", nativeQuery = true)
    List<ErrorEvent> findByProjectIdWithFilters(
        @Param("projectId") Integer projectId,
        @Param("status") String status,
        @Param("severity") String severity,
        @Param("type") String type,
        @Param("search") String search
    );

}
