package com.errortracker.service;

import com.errortracker.entity.User;
import com.errortracker.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public User createUser(String username, String password, String email, String firstName, String lastName) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        
        boolean isFirstUser = userRepository.count() == 0;
        user.setRole(isFirstUser ? "ADMIN" : "USER");
        
        return userRepository.save(user);
    }
    
    public User createUserFromInvitation(String username, String password, String email, String firstName, String lastName) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole("USER");
        
        return userRepository.save(user);
    }
    
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }
    
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }
    
    public boolean isEmailTaken(String email) {
        return userRepository.existsByEmail(email);
    }
}
