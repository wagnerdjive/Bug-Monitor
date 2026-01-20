package com.errortracker.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "error_events")
public class ErrorEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "project_id", nullable = false)
    private Integer projectId;
    
    @Column(nullable = false)
    private String type;
    
    @Column(nullable = false)
    private String status = "unresolved";
    
    @Column(nullable = false)
    private String severity = "medium";
    
    @Column(nullable = false)
    private String message;
    
    @Column(name = "stack_trace", columnDefinition = "TEXT")
    private String stackTrace;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "device_info", columnDefinition = "jsonb")
    private Map<String, Object> deviceInfo;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "platform_info", columnDefinition = "jsonb")
    private Map<String, Object> platformInfo;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> tags;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Object breadcrumbs;
    
    @Column(name = "occurred_at")
    private LocalDateTime occurredAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    private Project project;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (occurredAt == null) {
            occurredAt = LocalDateTime.now();
        }
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    
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
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
}
