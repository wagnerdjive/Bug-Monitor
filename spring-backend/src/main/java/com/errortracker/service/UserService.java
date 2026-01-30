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
        
        user.setRole("USER");
        user.setCanCreateProjects(true); // Users registered via portal can create projects
        
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
        user.setCanCreateProjects(false); // Users from invitation cannot create projects
        
        return userRepository.save(user);
    }
    
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByUsernameOrEmail(String login) {
        Optional<User> user = userRepository.findByUsername(login);
        if (user.isEmpty()) {
            user = userRepository.findByEmail(login);
        }
        return user;
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
    
    public User updateProfile(Integer userId, String firstName, String lastName, String email, String profileImageUrl) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (firstName != null) {
            user.setFirstName(firstName);
        }
        if (lastName != null) {
            user.setLastName(lastName);
        }
        if (email != null && !email.equals(user.getEmail())) {
            if (userRepository.existsByEmail(email)) {
                throw new IllegalArgumentException("Email already in use");
            }
            user.setEmail(email);
        }
        if (profileImageUrl != null) {
            user.setProfileImageUrl(profileImageUrl);
        }
        
        return userRepository.save(user);
    }
    
    public User createFromOAuth(String username, String email, String firstName, String lastName, String profileImageUrl) {
        String uniqueUsername = username;
        int counter = 1;
        while (userRepository.existsByUsername(uniqueUsername)) {
            uniqueUsername = username + counter;
            counter++;
        }
        
        User user = new User();
        user.setUsername(uniqueUsername);
        user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setProfileImageUrl(profileImageUrl);
        
        user.setRole("USER");
        user.setCanCreateProjects(true);
        
        return userRepository.save(user);
    }
    
    public User save(User user) {
        return userRepository.save(user);
    }
}
