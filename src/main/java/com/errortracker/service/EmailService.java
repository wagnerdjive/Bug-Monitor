package com.errortracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${app.feature.email-enabled:false}")
    private boolean emailEnabled;
    
    @Value("${app.email.from:noreply@techmonitor.app}")
    private String fromEmail;
    
    @Value("${app.email.base-url:http://localhost:5000}")
    private String baseUrl;
    
    public boolean isEmailEnabled() {
        return emailEnabled && mailSender != null;
    }
    
    public void sendWelcomeEmail(String toEmail, String username) {
        if (!isEmailEnabled()) {
            System.out.println("[EMAIL DISABLED] Would send welcome email to: " + toEmail);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to TechMonitor!");
        message.setText("Hello " + username + ",\n\nYour account has been successfully created. You can now start monitoring your applications.\n\nBest regards,\nThe TechMonitor Team");

        try {
            mailSender.send(message);
            System.out.println("[EMAIL] Welcome email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("[EMAIL] Failed to send welcome email to " + toEmail + ": " + e.getMessage());
        }
    }

    public void sendInvitationEmail(String toEmail, String inviteToken, String invitedByUsername) {
        if (mailSender == null) {
            System.out.println("[EMAIL] Mail sender not configured, skipping email to: " + toEmail);
            return;
        }
        
        if (!emailEnabled) {
            System.out.println("[EMAIL] Email disabled, would send invitation to: " + toEmail);
            return;
        }
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("TechMonitor - Invitation");
        message.setText(buildInvitationEmailBody(inviteToken, invitedByUsername));
        
        try {
            mailSender.send(message);
            System.out.println("[EMAIL] Invitation sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("[EMAIL] Failed to send invitation to " + toEmail + ": " + e.getMessage());
        }
    }
    
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        if (!isEmailEnabled()) {
            System.out.println("[EMAIL DISABLED] Would send password reset to: " + toEmail);
            System.out.println("[EMAIL DISABLED] Reset link: " + baseUrl + "/reset-password?token=" + resetToken);
            return;
        }
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Reset your TechMonitor password");
        message.setText(buildPasswordResetEmailBody(resetToken));
        
        try {
            mailSender.send(message);
            System.out.println("Password reset email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email to " + toEmail + ": " + e.getMessage());
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
    
    private String buildInvitationEmailBody(String inviteToken, String invitedByUsername) {
        return String.format("""
            Hello!
            
            You've been invited to join TechMonitor by %s.
            
            TechMonitor is a real-time error tracking and performance monitoring platform for developers.
            
            Click the link below to accept the invitation and create your account:
            
            %s/accept-invite?token=%s
            
            This invitation link will expire in 7 days.
            
            If you did not expect this invitation, you can safely ignore this email.
            
            Best regards,
            The TechMonitor Team
            """, invitedByUsername, baseUrl, inviteToken);
    }
    
    private String buildPasswordResetEmailBody(String resetToken) {
        return String.format("""
            Hello!
            
            We received a request to reset your TechMonitor password.
            
            Click the link below to reset your password:
            
            %s/reset-password?token=%s
            
            This link will expire in 1 hour.
            
            If you did not request a password reset, you can safely ignore this email.
            
            Best regards,
            The TechMonitor Team
            """, baseUrl, resetToken);
    }
}
