package com.errortracker.service;

import com.errortracker.entity.ProjectUser;
import com.errortracker.entity.User;
import com.errortracker.repository.ProjectUserRepository;
import com.errortracker.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectUserService {
    private final ProjectUserRepository projectUserRepository;
    private final UserRepository userRepository;
    
    public ProjectUserService(ProjectUserRepository projectUserRepository, UserRepository userRepository) {
        this.projectUserRepository = projectUserRepository;
        this.userRepository = userRepository;
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
    
    public List<Map<String, Object>> getProjectUsersWithDetails(Integer projectId) {
        List<ProjectUser> projectUsers = projectUserRepository.findByProjectId(projectId);
        
        return projectUsers.stream().map(pu -> {
            Map<String, Object> result = new HashMap<>();
            result.put("id", pu.getId());
            result.put("userId", pu.getUserId());
            result.put("projectId", pu.getProjectId());
            result.put("role", pu.getRole());
            
            Optional<User> user = userRepository.findById(pu.getUserId());
            if (user.isPresent()) {
                User u = user.get();
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", u.getId());
                userMap.put("username", u.getUsername());
                userMap.put("email", u.getEmail());
                userMap.put("firstName", u.getFirstName());
                userMap.put("lastName", u.getLastName());
                userMap.put("profileImageUrl", u.getProfileImageUrl());
                result.put("user", userMap);
            }
            
            return result;
        }).collect(Collectors.toList());
    }
    
    @Transactional
    public void removeProjectUser(Integer projectUserId, Integer projectId) {
        Optional<ProjectUser> projectUser = projectUserRepository.findById(projectUserId);
        if (projectUser.isEmpty()) {
            throw new IllegalArgumentException("Project user not found");
        }
        if (!projectUser.get().getProjectId().equals(projectId)) {
            throw new IllegalArgumentException("Project user does not belong to this project");
        }
        projectUserRepository.deleteById(projectUserId);
    }
}
