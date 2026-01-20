package com.errortracker.repository;

import com.errortracker.entity.ProjectUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectUserRepository extends JpaRepository<ProjectUser, Integer> {
    List<ProjectUser> findByProjectId(Integer projectId);
    List<ProjectUser> findByUserId(Integer userId);
    Optional<ProjectUser> findByProjectIdAndUserId(Integer projectId, Integer userId);
    boolean existsByProjectIdAndUserId(Integer projectId, Integer userId);
    void deleteByProjectIdAndUserId(Integer projectId, Integer userId);
}
