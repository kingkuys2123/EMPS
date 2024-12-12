package com.appdev.wue.service;

import com.appdev.wue.entity.PaymentMethodEntity;
import com.appdev.wue.entity.UserEntity;
import com.appdev.wue.repository.PaymentMethodRepository;
import com.appdev.wue.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class PaymentMethodService {
    @Autowired
    private PaymentMethodRepository pmRepo;

    @Autowired
    private UserRepository uRepo;

    // Create Payment Details
    public PaymentMethodEntity createPaymentMethod(PaymentMethodEntity paymentDetails) {
        return pmRepo.save(paymentDetails);
    }

    // Get All Payment Details
    public List<PaymentMethodEntity> getAllPaymentMethods() {
        return pmRepo.findAll();
    }

    // Get Payment Details by ID
    public PaymentMethodEntity getPaymentMethod(int id) {
        return pmRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Payment Details with ID " + id + " not found!"));
    }

    // Update Payment Details by ID
    @SuppressWarnings("finally")
    public PaymentMethodEntity updatePaymentMethod(int id, PaymentMethodEntity updatedPaymentDetails) {
        PaymentMethodEntity paymentDetails = new PaymentMethodEntity();
        try {
            paymentDetails = pmRepo.findById(id).get();

            paymentDetails.setPaymentType(updatedPaymentDetails.getPaymentType());
            paymentDetails.setCreditCardNumber(updatedPaymentDetails.getCreditCardNumber());
            paymentDetails.setCreditCardExpiry(updatedPaymentDetails.getCreditCardExpiry());
            paymentDetails.setCreditCardCVV(updatedPaymentDetails.getCreditCardCVV());
            paymentDetails.setGCashName(updatedPaymentDetails.getGCashName());
            paymentDetails.setDateTimeCreated(LocalDateTime.now());
        } catch (Exception e) {
            throw new NoSuchElementException("Payment Details with ID " + id + " not found!");
        } finally {
            return pmRepo.save(paymentDetails);
        }
    }

    // Delete Payment Details by ID
    public String deletePaymentMethod(int id) {
        String msg;
        try {
            if (pmRepo.existsById(id)) {
                pmRepo.deleteById(id);
                msg = "Payment Details deleted successfully!";
            } else {
                msg = "Payment Details not found!";
            }
        } catch (Exception e) {
            msg = "Error occurred while deleting the payment details with ID " + id + ": " + e.getMessage();
        }
        return msg;
    }


    // Add Payment Details for User
    public PaymentMethodEntity userAddPaymentMethod(int userId, PaymentMethodEntity paymentMethod) {
        UserEntity user = uRepo.findById(userId).orElseThrow(() -> new NoSuchElementException("User with ID " + userId + " not found!"));

        Optional<PaymentMethodEntity> existingPaymentMethod = pmRepo.findByUser(user);
        if (existingPaymentMethod.isPresent()) {
            throw new RuntimeException("You already have a payment method!");
        }

        if ("gcash".equalsIgnoreCase(paymentMethod.getPaymentType())) {
            paymentMethod.setCreditCardNumber(null);
            paymentMethod.setCreditCardExpiry(null);
            paymentMethod.setCreditCardCVV(null);
        } else if ("credit_card".equalsIgnoreCase(paymentMethod.getPaymentType())) {
            paymentMethod.setGCashName(null);
            paymentMethod.setGCashNumber(null);
        } else {
            throw new IllegalArgumentException("Invalid payment method: " + paymentMethod.getPaymentType());
        }

        paymentMethod.setUser(user);
        paymentMethod.setPaymentMethodId(user.getUserID());
        paymentMethod.setDateTimeCreated(LocalDateTime.now());

        return pmRepo.save(paymentMethod);
    }

    // Get User Payment Method
    public PaymentMethodEntity getUserPaymentMethod(int userId) {
        UserEntity user = uRepo.findById(userId).orElseThrow(() -> new NoSuchElementException("User with ID " + userId + " not found!"));
        return pmRepo.findByUser(user).orElseThrow(() -> new NoSuchElementException("Payment method for user with ID " + userId + " not found!"));
    }

    // Update User Payment Method
    public PaymentMethodEntity updateUserPaymentMethod(int userId, PaymentMethodEntity updatedPaymentDetails) {
        UserEntity user = uRepo.findById(userId).orElseThrow(() -> new NoSuchElementException("User with ID " + userId + " not found!"));
        PaymentMethodEntity paymentDetails = pmRepo.findByUser(user).orElseThrow(() -> new NoSuchElementException("Payment method for user with ID " + userId + " not found!"));

        if ("gcash".equalsIgnoreCase(updatedPaymentDetails.getPaymentType())) {
            paymentDetails.setCreditCardNumber(null);
            paymentDetails.setCreditCardExpiry(null);
            paymentDetails.setCreditCardCVV(null);
            paymentDetails.setGCashName(updatedPaymentDetails.getGCashName());
            paymentDetails.setGCashNumber(updatedPaymentDetails.getGCashNumber());
        } else if ("credit_card".equalsIgnoreCase(updatedPaymentDetails.getPaymentType())) {
            paymentDetails.setCreditCardHolderName(updatedPaymentDetails.getCreditCardHolderName());
            paymentDetails.setCreditCardNumber(updatedPaymentDetails.getCreditCardNumber());
            paymentDetails.setCreditCardExpiry(updatedPaymentDetails.getCreditCardExpiry());
            paymentDetails.setCreditCardCVV(updatedPaymentDetails.getCreditCardCVV());
            paymentDetails.setGCashName(null);
            paymentDetails.setGCashNumber(null);
        } else {
            throw new IllegalArgumentException("Invalid payment method: " + updatedPaymentDetails.getPaymentType());
        }

        return pmRepo.save(paymentDetails);
    }

}
