package com.appdev.wue.controller;

import com.appdev.wue.entity.UserEntity;
import com.appdev.wue.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // Delete User By ID
    @DeleteMapping("/deleteUser/{id}")
    public String deleteUser(@PathVariable int id) {
        return uServ.deleteUser(id);
    }

}
