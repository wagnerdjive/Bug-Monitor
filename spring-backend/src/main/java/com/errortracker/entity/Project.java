package com.errortracker.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String platform;
    
    @Column(name = "api_key", unique = true, nullable = false)
    private String apiKey;
    
    @Column(name = "user_id", nullable = false)
    private Integer userId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    @JsonIgnore
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<ErrorEvent> events;
    
    @Transient
    private Long errorCount24h;
    
    @Transient
    private Long userCount24h;

    public Long getErrorCount24h() { return errorCount24h; }
    public void setErrorCount24h(Long errorCount24h) { this.errorCount24h = errorCount24h; }
    
    public Long getUserCount24h() { return userCount24h; }
    public void setUserCount24h(Long userCount24h) { this.userCount24h = userCount24h; }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }
    
    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }
    
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public List<ErrorEvent> getEvents() { return events; }
    public void setEvents(List<ErrorEvent> events) { this.events = events; }
}
