package com.errortracker.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.Map;

public class IngestRequest {
    @NotBlank(message = "API key is required")
    private String apiKey;
    
    @NotBlank(message = "Type is required")
    private String type;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    private String stackTrace;
    private Map<String, Object> deviceInfo;
    private Map<String, Object> platformInfo;
    private Map<String, Object> tags;
    private Object breadcrumbs;
    private LocalDateTime occurredAt;
    private String severity;
    private String status;

    private String traceId;
    private String userName;

    public String getTraceId() { return traceId; }
    public void setTraceId(String traceId) { this.traceId = traceId; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getStackTrace() { return stackTrace; }
    public void setStackTrace(String stackTrace) { this.stackTrace = stackTrace; }
    
    public Map<String, Object> getDeviceInfo() { return deviceInfo; }
    public void setDeviceInfo(Map<String, Object> deviceInfo) { this.deviceInfo = deviceInfo; }
    
    public Map<String, Object> getPlatformInfo() { return platformInfo; }
    public void setPlatformInfo(Map<String, Object> platformInfo) { this.platformInfo = platformInfo; }
    
    public Map<String, Object> getTags() { return tags; }
    public void setTags(Map<String, Object> tags) { this.tags = tags; }
    
    public Object getBreadcrumbs() { return breadcrumbs; }
    public void setBreadcrumbs(Object breadcrumbs) { this.breadcrumbs = breadcrumbs; }
    
    public LocalDateTime getOccurredAt() { return occurredAt; }
    public void setOccurredAt(LocalDateTime occurredAt) { this.occurredAt = occurredAt; }
    
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
