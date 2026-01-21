package com.errortracker.service;

import com.errortracker.dto.IngestRequest;
import com.errortracker.dto.UpdateEventRequest;
import com.errortracker.entity.ErrorEvent;
import com.errortracker.repository.ErrorEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ErrorEventService {
    private final ErrorEventRepository errorEventRepository;
    
    public ErrorEventService(ErrorEventRepository errorEventRepository) {
        this.errorEventRepository = errorEventRepository;
    }
    
    public List<ErrorEvent> getProjectEvents(Integer projectId, String status, String severity, String type, String search) {
        return errorEventRepository.findByProjectIdWithFilters(projectId, status, severity, type, search);
    }

    
    public Optional<ErrorEvent> getEvent(Integer id) {
        return errorEventRepository.findById(id);
    }
    
    public ErrorEvent createEvent(Integer projectId, IngestRequest request) {
        ErrorEvent event = new ErrorEvent();
        event.setProjectId(projectId);
        event.setType(request.getType());
        event.setMessage(request.getMessage());
        event.setStackTrace(request.getStackTrace());
        event.setDeviceInfo(request.getDeviceInfo());
        event.setPlatformInfo(request.getPlatformInfo());
        event.setTags(request.getTags());
        event.setBreadcrumbs(request.getBreadcrumbs());
        
        if (request.getOccurredAt() != null) {
            event.setOccurredAt(request.getOccurredAt());
        } else {
            event.setOccurredAt(java.time.LocalDateTime.now());
        }
        
        event.setTraceId(request.getTraceId());
        event.setUserName(request.getUserName());

        // Handle both 'severity' and 'level' for compatibility
        String severity = request.getSeverity();
        if (severity == null || severity.isEmpty()) {
            severity = request.getLevel();
        }
        
        if (severity != null) {
            event.setSeverity(severity);
        } else {
            event.setSeverity("medium");
        }
        
        if (request.getStatus() != null) {
            event.setStatus(request.getStatus());
        } else {
            event.setStatus("unresolved");
        }
        
        return errorEventRepository.save(event);
    }
    
    public ErrorEvent updateEvent(Integer id, UpdateEventRequest request) {
        ErrorEvent event = errorEventRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        
        if (request.getStatus() != null) {
            event.setStatus(request.getStatus());
        }
        if (request.getSeverity() != null) {
            event.setSeverity(request.getSeverity());
        }
        
        return errorEventRepository.save(event);
    }
}
