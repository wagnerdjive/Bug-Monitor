package com.errortracker.controller;

import com.errortracker.dto.IngestRequest;
import com.errortracker.dto.UpdateEventRequest;
import com.errortracker.entity.ErrorEvent;
import com.errortracker.entity.Project;
import com.errortracker.entity.User;
import com.errortracker.service.ErrorEventService;
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
@RequestMapping("/api")
public class EventController {
    private final ErrorEventService errorEventService;
    private final ProjectService projectService;
    private final UserService userService;
    private final ProjectUserService projectUserService;
    
    public EventController(ErrorEventService errorEventService, ProjectService projectService, UserService userService, ProjectUserService projectUserService) {
        this.errorEventService = errorEventService;
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
    
    @GetMapping("/projects/{projectId}/events")
    public ResponseEntity<?> listEvents(
            @PathVariable Integer projectId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search,
            HttpServletRequest request) {
        
        Integer userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Optional<Project> projectOpt = projectService.getProject(projectId);
        if (projectOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Admins have access to all projects' events, owners and assigned users have access
        Project project = projectOpt.get();
        if (!isAdmin(userId) && !hasProjectAccess(projectId, userId, project)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Unauthorized"));
        }
        
        List<ErrorEvent> events = errorEventService.getProjectEvents(projectId, status, severity, type, search);
        return ResponseEntity.ok(events);
    }

    
    @GetMapping("/events/{id}")
    public ResponseEntity<?> getEvent(@PathVariable Integer id, HttpServletRequest request) {
        Integer userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        return errorEventService.getEvent(id)
            .map(event -> {
                Optional<Project> projectOpt = projectService.getProject(event.getProjectId());
                if (projectOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
                }
                Project project = projectOpt.get();
                // Admins, owners, and assigned users have access to events
                if (!isAdmin(userId) && !hasProjectAccess(event.getProjectId(), userId, project)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
                }
                return ResponseEntity.ok(event);
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/events/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Integer id,
            @RequestBody UpdateEventRequest updateRequest,
            HttpServletRequest request) {
        
        Integer userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        return errorEventService.getEvent(id)
            .map(event -> {
                Optional<Project> projectOpt = projectService.getProject(event.getProjectId());
                if (projectOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
                }
                Project project = projectOpt.get();
                // Admins, owners, and assigned users can update events
                if (!isAdmin(userId) && !hasProjectAccess(event.getProjectId(), userId, project)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
                }
                
                ErrorEvent updated = errorEventService.updateEvent(id, updateRequest);
                return ResponseEntity.ok(updated);
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/ingest")
    public ResponseEntity<?> ingestEvent(@Valid @RequestBody IngestRequest ingestRequest) {
        System.out.println("Receiving error ingestion: " + ingestRequest.getMessage());
        
        Optional<Project> projectOpt = projectService.getProjectByApiKey(ingestRequest.getApiKey());
        if (projectOpt.isEmpty()) {
            System.out.println("Invalid API Key: " + ingestRequest.getApiKey());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Invalid API Key"));
        }
        
        ErrorEvent event = errorEventService.createEvent(projectOpt.get().getId(), ingestRequest);
        System.out.println("Created error event: " + event.getId());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }
}
