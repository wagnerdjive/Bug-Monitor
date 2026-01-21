package com.errortracker.controller;

import com.errortracker.dto.AuthRequest;
import com.errortracker.dto.ProfileUpdateRequest;
import com.errortracker.dto.UserResponse;
import com.errortracker.entity.Invitation;
import com.errortracker.entity.User;
import com.errortracker.service.InvitationService;
import com.errortracker.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final InvitationService invitationService;
    
    public AuthController(UserService userService, AuthenticationManager authenticationManager, InvitationService invitationService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.invitationService = invitationService;
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        try {
            if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Passwords do not match"));
            }

            User user = userService.createUser(
                request.getUsername(),
                request.getPassword(),
                request.getEmail(),
                request.getFirstName(),
                request.getLastName()
            );
            
            // Send welcome email
            emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());

            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            session.setAttribute("userId", user.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.fromUser(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            
            User user = userService.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            session.setAttribute("userId", user.getId());
            
            return ResponseEntity.ok(UserResponse.fromUser(user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid username or password"));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/auth/user")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        return userService.findById(userId)
            .map(user -> ResponseEntity.ok(UserResponse.fromUser(user)))
            .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
    
    @GetMapping("/register/invite/{token}")
    public ResponseEntity<?> getInvitation(@PathVariable String token) {
        Optional<Invitation> invitation = invitationService.findByToken(token);
        
        if (invitation.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Invitation not found"));
        }
        
        Invitation inv = invitation.get();
        if (inv.isExpired()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invitation has expired"));
        }
        
        if (!inv.isPending()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invitation has already been used"));
        }
        
        return ResponseEntity.ok(Map.of(
            "email", inv.getEmail(),
            "token", inv.getToken()
        ));
    }
    
    @PostMapping("/register/invite/{token}")
    public ResponseEntity<?> registerWithInvitation(
            @PathVariable String token,
            @Valid @RequestBody AuthRequest request,
            HttpServletRequest httpRequest) {
        
        Optional<Invitation> invitation = invitationService.findByToken(token);
        
        if (invitation.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Invitation not found"));
        }
        
        Invitation inv = invitation.get();
        if (inv.isExpired()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invitation has expired"));
        }
        
        if (!inv.isPending()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invitation has already been used"));
        }
        
        try {
            User user = userService.createUserFromInvitation(
                request.getUsername(),
                request.getPassword(),
                inv.getEmail(),
                request.getFirstName(),
                request.getLastName()
            );
            
            invitationService.markAsAccepted(inv);
            
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            session.setAttribute("userId", user.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.fromUser(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest request, HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            User user = userService.updateProfile(
                userId,
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getProfileImageUrl()
            );
            return ResponseEntity.ok(UserResponse.fromUser(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
