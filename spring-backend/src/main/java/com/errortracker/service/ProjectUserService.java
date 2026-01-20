package com.errortracker.service;

import com.errortracker.entity.ProjectUser;
import com.errortracker.repository.ProjectUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectUserService {
    private final ProjectUserRepository projectUserRepository;
    
    public ProjectUserService(ProjectUserRepository projectUserRepository) {
        this.projectUserRepository = projectUserRepository;
    }
    
    public ProjectUser assignUserToProject(Integer projectId, Integer userId, String role) {
        Optional<ProjectUser> existing = projectUserRepository.findByProjectIdAndUserId(projectId, userId);
        if (existing.isPresent()) {
            ProjectUser pu = existing.get();
            pu.setRole(role);
            return projectUserRepository.save(pu);
        }
        
        ProjectUser projectUser = new ProjectUser();
        projectUser.setProjectId(projectId);
        projectUser.setUserId(userId);
        projectUser.setRole(role);
        
        return projectUserRepository.save(projectUser);
    }
    
    public List<ProjectUser> getUsersByProjectId(Integer projectId) {
        return projectUserRepository.findByProjectId(projectId);
    }
    
    public List<ProjectUser> getProjectsByUserId(Integer userId) {
        return projectUserRepository.findByUserId(userId);
    }
    
    public boolean hasAccess(Integer projectId, Integer userId) {
        return projectUserRepository.existsByProjectIdAndUserId(projectId, userId);
    }
    
    @Transactional
    public void removeUserFromProject(Integer projectId, Integer userId) {
        projectUserRepository.deleteByProjectIdAndUserId(projectId, userId);
    }
}
