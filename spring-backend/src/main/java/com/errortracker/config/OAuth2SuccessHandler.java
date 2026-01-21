package com.errortracker.config;

import com.errortracker.entity.User;
import com.errortracker.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    
    private final UserService userService;
    
    public OAuth2SuccessHandler(UserService userService) {
        this.userService = userService;
    }
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        
        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        
        String email = principal.getAttribute("email");
        String preferredUsername = principal.getAttribute("preferred_username");
        String givenName = principal.getAttribute("given_name");
        String familyName = principal.getAttribute("family_name");
        
        String username = preferredUsername != null ? preferredUsername : email;
        
        Optional<User> existingUser = userService.findByEmail(email);
        User user;
        
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            user = userService.createFromOAuth(
                username,
                email,
                givenName,
                familyName,
                null
            );
        }
        
        HttpSession session = request.getSession(true);
        session.setAttribute("userId", user.getId());
        
        response.sendRedirect("/");
    }
}
