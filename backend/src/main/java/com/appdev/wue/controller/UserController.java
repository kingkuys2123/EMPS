package com.appdev.wue.controller;

import com.appdev.wue.entity.UserEntity;
import com.appdev.wue.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;


@RestController
@RequestMapping(method = RequestMethod.GET, path = "api/user")
public class UserController {

    @Autowired
    UserService uServ;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Create User
    @PostMapping("/createUser")
    public UserEntity createUser(@RequestBody UserEntity user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return uServ.createUser(user);
    }

    // Get All Users
    @GetMapping("/getAllUsers")
    public List<UserEntity> getAllUsers() {
        return uServ.getAllUsers();
    }

   // Backend: Get User By ID
    @GetMapping("/getUser/{id}")
    public ResponseEntity<?> getUser(@PathVariable int id) {
        try {
            UserEntity user = uServ.getUser(id);
            return ResponseEntity.ok(user); // Return the user if found
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body("User with ID " + id + " not found!"); // Return 404
        }
    }


    // Update User By ID
    @PutMapping("/updateUser")
    public UserEntity updateUser(@RequestParam int id, @RequestBody UserEntity newUserDetails) {
        if(newUserDetails.getPassword() != null) {
            newUserDetails.setPassword(passwordEncoder.encode(newUserDetails.getPassword()));
        }
        return uServ.updateUser(id, newUserDetails);
    }

    // Update Profile By ID (PUT)
    @PutMapping("/updateProfile")
    public UserEntity updateProfile(@RequestParam int id, @RequestBody UserEntity newUserDetails) {
        return uServ.updateProfile(id, newUserDetails);
    }

    // Delete User By ID
    @DeleteMapping("/deleteUser/{id}")
    public String deleteUser(@PathVariable int id) {
        return uServ.deleteUser(id);
    }

    // Register User
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserEntity user) {
        try {
            UserEntity newUser = uServ.registerUser(user);

            return ResponseEntity.ok(newUser);
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginDetails) {
        String username = loginDetails.get("username");
        String password = loginDetails.get("password");

        try {
            String token = uServ.loginUser(username, password);
            UserEntity user = uServ.findByUsername(username);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // Change Email
    @PutMapping("/changeEmail")
    public ResponseEntity<?> changeEmail(@RequestParam int id, @RequestBody UserEntity newUserDetails) {
        try {
            UserEntity updatedUser = uServ.changeEmail(id, newUserDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Change Password
    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestParam int id, @RequestBody Map<String, String> passwords){
        try{
            UserEntity updatedUser = uServ.changePassword(id, passwords.get("oldPassword"), passwords.get("newPassword"));
            return ResponseEntity.ok(updatedUser);
        }
        catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Upload Profile Picture
    @PostMapping("/uploadProfilePicture")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam int userId, @RequestParam("file") MultipartFile file) {
        try {
            UserEntity user = uServ.uploadProfilePicture(userId, file);
            return ResponseEntity.ok(user);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading profile picture: " + e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Get Profile Picture
    @GetMapping("/getProfilePicture/{filename}")
    public ResponseEntity<Resource> getProfilePicture(@PathVariable String filename) {
        try {
            Resource resource = uServ.getProfilePicture(filename);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
