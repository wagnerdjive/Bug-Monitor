package com.errortracker.service;

import com.errortracker.entity.Project;
import com.errortracker.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private static final SecureRandom secureRandom = new SecureRandom();
    
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }
    
    public List<Project> getProjectsByUserId(Integer userId) {
        return projectRepository.findByUserId(userId);
    }
    
    public Optional<Project> getProject(Integer id) {
        return projectRepository.findById(id);
    }
    
    public Optional<Project> getProjectByApiKey(String apiKey) {
        return projectRepository.findByApiKey(apiKey);
    }
    
    public Project createProject(String name, String platform, Integer userId) {
        Project project = new Project();
        project.setName(name);
        project.setPlatform(platform);
        project.setUserId(userId);
        project.setApiKey(generateApiKey());
        
        return projectRepository.save(project);
    }
    
    public void deleteProject(Integer id) {
        projectRepository.deleteById(id);
    }
    
    private String generateApiKey() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
