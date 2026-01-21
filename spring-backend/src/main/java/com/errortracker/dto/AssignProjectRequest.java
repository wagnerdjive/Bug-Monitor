package com.errortracker.dto;

public class AssignProjectRequest {
    private Integer userId;
    private Integer projectId;
    private String role = "VIEWER";

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    
    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
