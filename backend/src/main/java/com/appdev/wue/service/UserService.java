package com.appdev.wue.service;

import com.appdev.wue.entity.UserEntity;
import com.appdev.wue.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.naming.NameNotFoundException;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository uRepo;

    // Get User By Username
    public UserEntity findByUsername(String username) {
        return uRepo.findByUsername(username).orElse(null);
    }

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
        return uRepo.findById(id).orElse(null);
    }

    // Update User By ID
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
            user.setDateCreated(newUserDetails.getDateCreated());
        } catch (Exception e) {
            throw new NameNotFoundException("User with ID " + id + " not found!");
        } finally {
            return uRepo.save(user);
        }
    }

    // Update Profile
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
        if (uRepo.existsById(id)) {
            uRepo.deleteById(id);
            msg = "User with ID " + id + " deleted successfully!";
        } else {
            msg = "User with ID " + id + " not found!";
        }
        return msg;
    }

}
