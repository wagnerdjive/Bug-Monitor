package com.errortracker.controller;

import com.errortracker.dto.ProjectRequest;
import com.errortracker.entity.Project;
import com.errortracker.service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;
    
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }
    
    private Integer getUserId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return null;
        return (Integer) session.getAttribute("userId");
    }
    
    @GetMapping
    public ResponseEntity<?> listProjects(HttpServletRequest request) {
        Integer userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        List<Project> projects = projectService.getProjectsByUserId(userId);
        return ResponseEntity.ok(projects);
    }
    
    @PostMapping
    public ResponseEntity<?> createProject(@Valid @RequestBody ProjectRequest projectRequest, HttpServletRequest request) {
        Integer userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Project project = projectService.createProject(
            projectRequest.getName(),
            projectRequest.getPlatform(),
            userId
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getProject(@PathVariable Integer id, HttpServletRequest request) {
        Integer userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        return projectService.getProject(id)
            .map(project -> {
                if (!project.getUserId().equals(userId)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
                }
                return ResponseEntity.ok(project);
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Integer id, HttpServletRequest request) {
        Integer userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        return projectService.getProject(id)
            .map(project -> {
                if (!project.getUserId().equals(userId)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
                }
                projectService.deleteProject(id);
                return ResponseEntity.noContent().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
