package com.appdev.wue.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.appdev.wue.entity.UserEntity;
import com.appdev.wue.repository.UserRepository;
import com.appdev.wue.util.JwtUtil;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserService {

    @Autowired
    private UserRepository uRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${upload.dir}")
    private String uploadDir;

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
            System.out.println("Before update: " + user); // Log the current user before update
            user.setUsername(newUserDetails.getUsername());
            user.setPassword(newUserDetails.getPassword());
            user.setEmail(newUserDetails.getEmail());
            user.setFirstName(newUserDetails.getFirstName());
            user.setLastName(newUserDetails.getLastName());
            user.setAccountType(newUserDetails.getAccountType());
            user.setPhoneNumber(newUserDetails.getPhoneNumber());
            user.setDateTimeCreated(newUserDetails.getDateTimeCreated());
            System.out.println("After update: " + user); // Log the updated user
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

    // Change Email
    public UserEntity changeEmail(int id, UserEntity newUserDetails) {
        if (uRepo.findByEmail(newUserDetails.getEmail()).isPresent()) {
            throw new RuntimeException("Email already taken!");
        }

        UserEntity user = uRepo.findById(id).get();

        user.setEmail(newUserDetails.getEmail());
        return uRepo.save(user);
    }

    // Change Password
    public UserEntity changePassword(int id, String oldPassword, String newPassword){
        UserEntity user = uRepo.findById(id).get();

        if(!passwordEncoder.matches(oldPassword, user.getPassword())){
            throw new RuntimeException("Invalid password!");
        }
        if(oldPassword.equals(newPassword)){
            throw new RuntimeException("New password cannot be the old password!");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        return uRepo.save(user);
    }

    // Upload Profile Picture
    public UserEntity uploadProfilePicture(int id, MultipartFile file) throws IOException {
        UserEntity user = uRepo.findById(id).orElseThrow(() -> new NoSuchElementException("User with ID " + id + " not found!"));

        String originalFileName = file.getOriginalFilename();
        assert originalFileName != null;
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String fileName = id + "_profile_picture" + fileExtension;

        Path filePath = Paths.get(uploadDir + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        user.setProfilePicture(fileName);
        return uRepo.save(user);
    }

    // Get Profile Picture
    public Resource getProfilePicture(String filename) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists()) {
            return resource;
        } else {
            throw new NoSuchElementException("Profile picture not found");
        }
    }

    // Delete Profile Picture
    public String deleteProfilePicture(int id) throws IOException {
        UserEntity user = uRepo.findById(id).orElseThrow(() -> new NoSuchElementException("User with ID " + id + " not found!"));

        String profilePicture = user.getProfilePicture();
        if (profilePicture == null) {
            throw new NoSuchElementException("Profile picture not found for user with ID " + id);
        }

        Path filePath = Paths.get(uploadDir).resolve(profilePicture).normalize();
        Files.deleteIfExists(filePath);

        user.setProfilePicture(null);
        uRepo.save(user);

        return "Profile picture deleted successfully!";
    }

}
