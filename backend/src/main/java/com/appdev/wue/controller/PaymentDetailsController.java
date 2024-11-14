package com.appdev.wue.controller;

import com.appdev.wue.entity.PaymentDetailsEntity;
import com.appdev.wue.service.PaymentDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(method = RequestMethod.GET, path = "/api/payment_details")
public class PaymentDetailsController {

    @Autowired
    private PaymentDetailsService pdService;

    // Create Payment Details
    @PostMapping("/createPaymentDetails")
    public PaymentDetailsEntity createPaymentDetails(@RequestBody PaymentDetailsEntity paymentDetails) {
        return pdService.createPaymentDetails(paymentDetails);
    }

    // Get All Payment Details
    @PostMapping("/getAllPaymentDetails")
    public List<PaymentDetailsEntity> getAllPaymentDetails() {
        return pdService.getAllPaymentDetails();
    }

    // Get Payment Details by ID
    @PostMapping("/getPaymentDetails/{id}")
    public PaymentDetailsEntity getPaymentDetails(@PathVariable int id) {
        return pdService.getPaymentDetails(id);
    }

    // Update Payment Details by ID
    @PutMapping("/updatePaymentDetails")
    public PaymentDetailsEntity updatePaymentDetails(@RequestParam int id, @RequestBody PaymentDetailsEntity updatedPaymentDetails) {
        return pdService.updatePaymentDetails(id, updatedPaymentDetails);
    }

    // Delete Payment Details by ID
    @DeleteMapping("/deletePaymentDetails/{id}")
    public String deletePaymentDetails(@PathVariable int id) {
        return pdService.deletePaymentDetails(id);
    }

}
