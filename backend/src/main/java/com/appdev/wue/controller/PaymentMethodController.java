package com.appdev.wue.controller;

import com.appdev.wue.entity.PaymentMethodEntity;
import com.appdev.wue.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping(method = RequestMethod.GET, path = "/api/payment_method")
public class PaymentMethodController {

    @Autowired
    private PaymentMethodService pdService;

    // Create Payment Details
    @PostMapping("/createPaymentMethod")
    public PaymentMethodEntity createPaymentMethod(@RequestBody PaymentMethodEntity paymentMethod) {
        return pdService.createPaymentMethod(paymentMethod);
    }

    // Get All Payment Details
    @PostMapping("/getAllPaymentMethods")
    public List<PaymentMethodEntity> getAllPaymentMethods() {
        return pdService.getAllPaymentMethods();
    }

    // Get Payment Details by ID
    @PostMapping("/getPaymentMethod/{id}")
    public PaymentMethodEntity getPaymentMethod(@PathVariable int id) {
        return pdService.getPaymentMethod(id);
    }

    // Update Payment Details by ID
    @PutMapping("/updatePaymentMethod")
    public PaymentMethodEntity updatePaymentMethod(@RequestParam int id, @RequestBody PaymentMethodEntity updatedPaymentMethod) {
        return pdService.updatePaymentMethod(id, updatedPaymentMethod);
    }

    // Delete Payment Details by ID
    @DeleteMapping("/deletePaymentMethod/{id}")
    public String deletePaymentMethod(@PathVariable int id) {
        return pdService.deletePaymentMethod(id);
    }

    // Add Payment Details for User
    @PostMapping("/userAddPaymentMethod/{userId}")
    public ResponseEntity<?> userAddPaymentMethod(@PathVariable int userId, @RequestBody PaymentMethodEntity paymentMethod) {
        try {
            PaymentMethodEntity createdPaymentMethod = pdService.userAddPaymentMethod(userId, paymentMethod);
            return ResponseEntity.ok(createdPaymentMethod);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    // Get User Payment Method
    @GetMapping("/getUserPaymentMethod/{id}")
    public ResponseEntity<?> getUserPaymentMethod(@PathVariable int id) {
        try {
            PaymentMethodEntity paymentMethod = pdService.getUserPaymentMethod(id);
            return ResponseEntity.ok(paymentMethod);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    // Update User Payment Method
    @PutMapping("/updateUserPaymentMethod/{userId}")
    public ResponseEntity<?> updateUserPaymentMethod(@PathVariable int userId, @RequestBody PaymentMethodEntity updatedPaymentDetails) {
        try {
            PaymentMethodEntity updatedPaymentMethod = pdService.updateUserPaymentMethod(userId, updatedPaymentDetails);
            return ResponseEntity.ok(updatedPaymentMethod);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

}
