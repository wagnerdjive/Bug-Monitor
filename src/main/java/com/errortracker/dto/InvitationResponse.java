package com.errortracker.dto;

import com.errortracker.entity.Invitation;
import java.time.LocalDateTime;

public class InvitationResponse {
    private Integer id;
    private String email;
    private String token;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    
    public static InvitationResponse fromInvitation(Invitation invitation) {
        InvitationResponse response = new InvitationResponse();
        response.id = invitation.getId();
        response.email = invitation.getEmail();
        response.token = invitation.getToken();
        response.status = invitation.getStatus();
        response.createdAt = invitation.getCreatedAt();
        response.expiresAt = invitation.getExpiresAt();
        return response;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}
