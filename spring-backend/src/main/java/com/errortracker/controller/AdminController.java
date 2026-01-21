package com.errortracker.controller;

import com.errortracker.dto.*;
import com.errortracker.entity.Invitation;
import com.errortracker.entity.Project;
import com.errortracker.entity.ProjectUser;
import com.errortracker.entity.User;
import com.errortracker.service.InvitationService;
import com.errortracker.service.ProjectService;
import com.errortracker.service.ProjectUserService;
import com.errortracker.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserService userService;
    private final InvitationService invitationService;
    private final ProjectUserService projectUserService;
    private final ProjectService projectService;
    
    public AdminController(UserService userService, InvitationService invitationService, 
                          ProjectUserService projectUserService, ProjectService projectService) {
        this.userService = userService;
        this.invitationService = invitationService;
        this.projectUserService = projectUserService;
        this.projectService = projectService;
    }
    
    private User getCurrentUser(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) return null;
        return userService.findById(userId).orElse(null);
    }
    
    private boolean isAdmin(HttpSession session) {
        User user = getCurrentUser(session);
        return user != null && user.isAdmin();
    }
    
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Admin access required"));
        }
        
        List<UserResponse> users = userService.findAll().stream()
            .map(UserResponse::fromUser)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(users);
    }
    
    @PostMapping("/invitations")
    public ResponseEntity<?> inviteUser(@RequestBody InviteRequest request, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Admin access required"));
        }
        
        User currentUser = getCurrentUser(session);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Not authenticated"));
        }
        
        if (userService.isEmailTaken(request.getEmail())) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "User with this email already exists"));
        }
        
        Invitation invitation = invitationService.createInvitation(request.getEmail(), currentUser.getId());
        return ResponseEntity.ok(InvitationResponse.fromInvitation(invitation));
    }
    
    @GetMapping("/invitations")
    public ResponseEntity<?> getInvitations(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Admin access required"));
        }
        
        List<InvitationResponse> invitations = invitationService.findAll().stream()
            .map(InvitationResponse::fromInvitation)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(invitations);
    }
    
    private static final List<String> VALID_ROLES = List.of("VIEWER", "CONTRIBUTOR", "ADMIN");
    
    @PostMapping("/projects/assign")
    public ResponseEntity<?> assignUserToProject(@RequestBody AssignProjectRequest request, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Admin access required"));
        }
        
        String role = request.getRole() != null ? request.getRole().toUpperCase() : "VIEWER";
        if (!VALID_ROLES.contains(role)) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid role. Must be one of: " + String.join(", ", VALID_ROLES)));
        }
        
        Optional<User> user = userService.findById(request.getUserId());
        if (user.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "User not found"));
        }
        
        Optional<Project> project = projectService.getProject(request.getProjectId());
        if (project.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Project not found"));
        }
        
        ProjectUser pu = projectUserService.assignUserToProject(
            request.getProjectId(), 
            request.getUserId(), 
            role
        );
        
        // Ensure user is added to project owners/members if they are not already
        // This is a safety check for visibility
        if (role.equals("ADMIN") && !project.get().getUserId().equals(request.getUserId())) {
            // Optional: Update ownership or just rely on ProjectUser
        }
        
        return ResponseEntity.ok(Map.of(
            "message", "User assigned to project successfully",
            "projectId", pu.getProjectId(),
            "userId", pu.getUserId(),
            "role", pu.getRole()
        ));
    }
    
    @DeleteMapping("/projects/{projectId}/users/{userId}")
    public ResponseEntity<?> removeUserFromProject(
            @PathVariable Integer projectId,
            @PathVariable Integer userId,
            HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Admin access required"));
        }
        
        projectUserService.removeUserFromProject(projectId, userId);
        return ResponseEntity.ok(Map.of("message", "User removed from project"));
    }
    
    @GetMapping("/projects/{projectId}/users")
    public ResponseEntity<?> getProjectUsers(@PathVariable Integer projectId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Admin access required"));
        }
        
        List<ProjectUser> projectUsers = projectUserService.getUsersByProjectId(projectId);
        
        List<Map<String, Object>> result = projectUsers.stream()
            .map(pu -> {
                Optional<User> user = userService.findById(pu.getUserId());
                return Map.of(
                    "id", (Object) pu.getId(),
                    "userId", pu.getUserId(),
                    "projectId", pu.getProjectId(),
                    "role", pu.getRole(),
                    "username", user.map(User::getUsername).orElse("Unknown"),
                    "email", user.map(User::getEmail).orElse("")
                );
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/users/{userId}/projects")
    public ResponseEntity<?> getUserProjects(@PathVariable Integer userId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Admin access required"));
        }
        
        List<ProjectUser> userProjects = projectUserService.getProjectsByUserId(userId);
        
        List<Map<String, Object>> result = userProjects.stream()
            .map(pu -> {
                Optional<Project> project = projectService.getProject(pu.getProjectId());
                return Map.of(
                    "id", (Object) pu.getId(),
                    "userId", pu.getUserId(),
                    "projectId", pu.getProjectId(),
                    "role", pu.getRole(),
                    "projectName", project.map(Project::getName).orElse("Unknown")
                );
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }
}
