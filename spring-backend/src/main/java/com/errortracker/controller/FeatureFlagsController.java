package com.errortracker.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/feature-flags")
public class FeatureFlagsController {
    
    @Value("${app.feature.keycloak-enabled:false}")
    private boolean keycloakEnabled;
    
    @Value("${app.feature.email-enabled:false}")
    private boolean emailEnabled;
    
    @GetMapping
    public ResponseEntity<?> getFeatureFlags() {
        return ResponseEntity.ok(Map.of(
            "keycloakEnabled", keycloakEnabled,
            "emailEnabled", emailEnabled
        ));
    }
}
