package com.appdev.wue.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.appdev.wue.entity.UserEntity;
import com.appdev.wue.repository.UserRepository;
import com.appdev.wue.util.JwtUtil;

@Service
public class UserService {

    @Autowired
    private UserRepository uRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Create User
    public UserEntity createUser(UserEntity user) {
        return uRepo.save(user);
    }

    // Get All Users
    public List<UserEntity> getAllUsers() {
        return uRepo.findAll();
    }

    // Get User By ID
    public UserEntity getUser(int id) {
        return uRepo.findById(id).orElseThrow(() -> new NoSuchElementException("User with ID " + id + " not found!"));
    }

    // Update User By ID (PUT)
    @SuppressWarnings("finally")
    public UserEntity updateUser(int id, UserEntity newUserDetails) {
        UserEntity user = new UserEntity();
        try {
            user = uRepo.findById(id).get();

            user.setUsername(newUserDetails.getUsername());
            user.setPassword(newUserDetails.getPassword());
            user.setEmail(newUserDetails.getEmail());
            user.setFirstName(newUserDetails.getFirstName());
            user.setLastName(newUserDetails.getLastName());
            user.setAccountType(newUserDetails.getAccountType());
            user.setPhoneNumber(newUserDetails.getPhoneNumber());
            user.setDateTimeCreated(newUserDetails.getDateTimeCreated());
        } catch (Exception e) {
            throw new NameNotFoundException("User with ID " + id + " not found!");
        } finally {
            return uRepo.save(user);
        }
    }

    // Update Profile
    @SuppressWarnings("finally")
    public UserEntity updateProfile(int id, UserEntity newUserDetails) {
        UserEntity user = new UserEntity();
        try {
            user = uRepo.findById(id).get();

            user.setUsername(newUserDetails.getUsername());
            user.setFirstName(newUserDetails.getFirstName());
            user.setLastName(newUserDetails.getLastName());
            user.setPhoneNumber(newUserDetails.getPhoneNumber());
        } catch (Exception e) {
            throw new NameNotFoundException("User with ID " + id + " not found!");
        } finally {
            return uRepo.save(user);
        }
    }

    // Delete User By ID
    public String deleteUser(int id) {
        String msg;
        try {
            if (uRepo.existsById(id)) {
                uRepo.deleteById(id);
                msg = "User deleted successfully!";
            } else {
                msg = "User not found!";
            }
        } catch (Exception e) {
            msg = "Error occurred while deleting the user with ID " + id + ": " + e.getMessage();
        }
        return msg;
    }

    // Register User
    public UserEntity registerUser(UserEntity user) {
        if (uRepo.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken!");
        }
        if (uRepo.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already taken!");
        }

        user.setAccountType("user");
        user.setDateTimeCreated(LocalDateTime.now());
        user.setPhoneNumber("");

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return uRepo.save(user);
    }

    // Login User
    public String loginUser(String username, String password) {
        UserEntity user = findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found!");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }
        return jwtUtil.generateToken(username);
    }

    // Get User By Username
    public UserEntity findByUsername(String username) {
        return uRepo.findByUsername(username).orElse(null);
    }

}
