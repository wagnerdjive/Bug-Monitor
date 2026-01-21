package com.errortracker.dto;

import jakarta.validation.constraints.NotBlank;

public class ProjectRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Platform is required")
    private String platform;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }
}
