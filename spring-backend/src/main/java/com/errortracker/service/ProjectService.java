package com.errortracker.service;

import com.errortracker.entity.Project;
import com.errortracker.repository.ProjectRepository;
import com.errortracker.repository.ErrorEventRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final ErrorEventRepository errorEventRepository;
    private static final SecureRandom secureRandom = new SecureRandom();
    
    public ProjectService(ProjectRepository projectRepository, ErrorEventRepository errorEventRepository) {
        this.projectRepository = projectRepository;
        this.errorEventRepository = errorEventRepository;
    }
    
    public List<Project> getProjectsByUserId(Integer userId) {
        List<Project> projects = projectRepository.findByUserId(userId);
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        
        for (Project project : projects) {
            long errorCount = errorEventRepository.countByProjectIdAndCreatedAtAfter(project.getId(), since);
            long userCount = errorEventRepository.countDistinctUsersByProjectIdAndCreatedAtAfter(project.getId(), since);
            
            project.setErrorCount24h(errorCount);
            project.setUserCount24h(userCount);
        }
        
        return projects;
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
