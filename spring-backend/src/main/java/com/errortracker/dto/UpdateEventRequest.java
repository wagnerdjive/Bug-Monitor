package com.errortracker.dto;

public class UpdateEventRequest {
    private String status;
    private String severity;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
}
