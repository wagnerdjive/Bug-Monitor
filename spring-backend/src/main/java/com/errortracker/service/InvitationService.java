package com.errortracker.service;

import com.errortracker.entity.Invitation;
import com.errortracker.repository.InvitationRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;

@Service
public class InvitationService {
    private final InvitationRepository invitationRepository;
    private static final SecureRandom secureRandom = new SecureRandom();
    
    public InvitationService(InvitationRepository invitationRepository) {
        this.invitationRepository = invitationRepository;
    }
    
    public Invitation createInvitation(String email, Integer invitedBy) {
        Optional<Invitation> existing = invitationRepository.findByEmailAndStatus(email, "PENDING");
        if (existing.isPresent()) {
            return existing.get();
        }
        
        Invitation invitation = new Invitation();
        invitation.setEmail(email);
        invitation.setToken(generateToken());
        invitation.setInvitedBy(invitedBy);
        invitation.setStatus("PENDING");
        
        return invitationRepository.save(invitation);
    }
    
    public Optional<Invitation> findByToken(String token) {
        return invitationRepository.findByToken(token);
    }
    
    public List<Invitation> findByInvitedBy(Integer invitedBy) {
        return invitationRepository.findByInvitedBy(invitedBy);
    }
    
    public List<Invitation> findAll() {
        return invitationRepository.findAll();
    }
    
    public void markAsAccepted(Invitation invitation) {
        invitation.setStatus("ACCEPTED");
        invitationRepository.save(invitation);
    }
    
    public boolean hasPendingInvitation(String email) {
        return invitationRepository.existsByEmailAndStatus(email, "PENDING");
    }
    
    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
