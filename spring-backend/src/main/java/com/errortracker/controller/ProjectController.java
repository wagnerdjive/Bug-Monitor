package com.errortracker.controller;

import com.errortracker.dto.ProjectRequest;
import com.errortracker.entity.Project;
import com.errortracker.entity.User;
import com.errortracker.service.ProjectService;
import com.errortracker.service.ProjectUserService;
import com.errortracker.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;
    private final UserService userService;
    private final ProjectUserService projectUserService;
    
    public ProjectController(ProjectService projectService, UserService userService, ProjectUserService projectUserService) {
        this.projectService = projectService;
        this.userService = userService;
        this.projectUserService = projectUserService;
    }
    
    private Integer getUserId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return null;
        return (Integer) session.getAttribute("userId");
    }
    
    private boolean isAdmin(Integer userId) {
        if (userId == null) return false;
        Optional<User> user = userService.findById(userId);
        return user.map(User::isAdmin).orElse(false);
    }
    
    private boolean hasProjectAccess(Integer projectId, Integer userId, Project project) {
        // User is the owner
        if (project.getUserId().equals(userId)) {
            return true;
        }
        // User is assigned to the project
        return projectUserService.hasAccess(projectId, userId);
    }
    
    @GetMapping
    public ResponseEntity<?> listProjects(HttpServletRequest request) {
        Integer userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Admin users have access to all projects
        List<Project> projects;
        if (isAdmin(userId)) {
            projects = projectService.getAllProjects();
        } else {
            projects = projectService.getProjectsByUserId(userId);
        }
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
                // Admins have access to all projects, owners and assigned users have access
                if (!isAdmin(userId) && !hasProjectAccess(id, userId, project)) {
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
                // Only admins and owners can delete projects (not assigned users)
                if (!isAdmin(userId) && !project.getUserId().equals(userId)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
                }
                projectService.deleteProject(id);
                return ResponseEntity.noContent().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/users")
    public ResponseEntity<?> getProjectUsers(@PathVariable Integer id, HttpServletRequest request) {
        Integer userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        return projectService.getProject(id)
            .map(project -> {
                if (!isAdmin(userId) && !hasProjectAccess(id, userId, project)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
                }
                return ResponseEntity.ok(projectUserService.getProjectUsersWithDetails(id));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{projectId}/users/{projectUserId}")
    public ResponseEntity<?> removeUserFromProject(
            @PathVariable Integer projectId, 
            @PathVariable Integer projectUserId, 
            HttpServletRequest request) {
        Integer userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        return projectService.getProject(projectId)
            .map(project -> {
                // Only admins and owners can remove users from projects
                if (!isAdmin(userId) && !project.getUserId().equals(userId)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
                }
                
                try {
                    projectUserService.removeProjectUser(projectUserId, projectId);
                    return ResponseEntity.noContent().build();
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
                }
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
