package com.appdev.wue.service;

import com.appdev.wue.entity.PaymentDetailsEntity;
import com.appdev.wue.repository.PaymentDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PaymentDetailsService {
    @Autowired
    private PaymentDetailsRepository pdRepo;

    // Create Payment Details
    public PaymentDetailsEntity createPaymentDetails(PaymentDetailsEntity paymentDetails) {
        return pdRepo.save(paymentDetails);
    }

    // Get All Payment Details
    public List<PaymentDetailsEntity> getAllPaymentDetails() {
        return pdRepo.findAll();
    }

    // Get Payment Details by ID
    public PaymentDetailsEntity getPaymentDetails(int id) {
        return pdRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Payment Details with ID " + id + " not found!"));
    }

    // Update Payment Details by ID
    @SuppressWarnings("finally")
    public PaymentDetailsEntity updatePaymentDetails(int id, PaymentDetailsEntity updatedPaymentDetails) {
        PaymentDetailsEntity paymentDetails = new PaymentDetailsEntity();
        try {
            paymentDetails = pdRepo.findById(id).get();

            paymentDetails.setPaymentMethod(updatedPaymentDetails.getPaymentMethod());
            paymentDetails.setCreditCardNumber(updatedPaymentDetails.getCreditCardNumber());
            paymentDetails.setCreditCardExpiry(updatedPaymentDetails.getCreditCardExpiry());
            paymentDetails.setCreditCardCVV(updatedPaymentDetails.getCreditCardCVV());
            paymentDetails.setGCashName(updatedPaymentDetails.getGCashName());
            paymentDetails.setDateTimeCreated(LocalDateTime.now());
        } catch (Exception e) {
            throw new NoSuchElementException("Payment Details with ID " + id + " not found!");
        } finally {
            return pdRepo.save(paymentDetails);
        }
    }

    // Delete Payment Details by ID
    public String deletePaymentDetails(int id) {
        String msg;
        try {
            if (pdRepo.existsById(id)) {
                pdRepo.deleteById(id);
                msg = "Payment Details deleted successfully!";
            } else {
                msg = "Payment Details not found!";
            }
        } catch (Exception e) {
            msg = "Error occurred while deleting the payment details with ID " + id + ": " + e.getMessage();
        }
        return msg;
    }
}
