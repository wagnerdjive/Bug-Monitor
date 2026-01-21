package com.errortracker.dto;

import com.errortracker.entity.ProjectUser;
import java.time.LocalDateTime;

public class ProjectUserResponse {
    private Integer id;
    private Integer projectId;
    private Integer userId;
    private String role;
    private LocalDateTime createdAt;
    private String username;
    private String email;
    private String projectName;
    
    public static ProjectUserResponse fromProjectUser(ProjectUser pu) {
        ProjectUserResponse response = new ProjectUserResponse();
        response.id = pu.getId();
        response.projectId = pu.getProjectId();
        response.userId = pu.getUserId();
        response.role = pu.getRole();
        response.createdAt = pu.getCreatedAt();
        if (pu.getUser() != null) {
            response.username = pu.getUser().getUsername();
            response.email = pu.getUser().getEmail();
        }
        if (pu.getProject() != null) {
            response.projectName = pu.getProject().getName();
        }
        return response;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }
    
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
}
