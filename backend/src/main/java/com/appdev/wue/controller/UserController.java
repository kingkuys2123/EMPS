package com.appdev.wue.controller;

import com.appdev.wue.entity.UserEntity;
import com.appdev.wue.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    // Get User By ID
    @GetMapping("/getUser/{id}")
    public UserEntity getUser(@PathVariable int id) {
        return uServ.getUser(id);
    }

    // Update User By ID
    @PutMapping("/updateUser")
    public UserEntity updateUser(@RequestParam int id, @RequestBody UserEntity newUserDetails) {
        if(newUserDetails.getPassword() != null) {
            newUserDetails.setPassword(passwordEncoder.encode(newUserDetails.getPassword()));
        }
        return uServ.updateUser(id, newUserDetails);
    }

    // Update Profile By ID
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

}
