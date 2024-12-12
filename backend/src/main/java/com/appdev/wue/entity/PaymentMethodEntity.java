package com.appdev.wue.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_method")
public class PaymentMethodEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int payment_method_id;

    @Column(name = "payment_type")
    private String payment_type;

    @Column(name = "credit_card_holder_name")
    private String credit_card_holder_name;

    @Column(name = "credit_card_number")
    private String credit_card_number;

    @Column(name = "credit_card_expiry")
    private String credit_card_expiry;

    @Column(name = "credit_card_cvv")
    private String credit_card_cvv;

    @Column(name = "gcash_name")
    private String gcash_name;

    @Column(name = "gcash_number")
    private String gcash_number;

    @Column(name = "datetime_created")
    private LocalDateTime datetime_created;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private UserEntity user;

    public int getPaymentMethodId() {
        return payment_method_id;
    }

    public void setPaymentMethodId(int payment_details_id) {
        this.payment_method_id = payment_details_id;
    }

    public String getPaymentType() {
        return payment_type;
    }

    public void setPaymentType(String payment_method) {
        this.payment_type = payment_method;
    }

    public String getCreditCardNumber() {
        return credit_card_number;
    }

    public void setCreditCardNumber(String credit_card_number) {
        this.credit_card_number = credit_card_number;
    }

    public String getCreditCardExpiry() {
        return credit_card_expiry;
    }

    public void setCreditCardExpiry(String credit_card_expiry) {
        this.credit_card_expiry = credit_card_expiry;
    }

    public String getCreditCardCVV() {
        return credit_card_cvv;
    }

    public void setCreditCardCVV(String credit_card_cvv) {
        this.credit_card_cvv = credit_card_cvv;
    }

    public String getGCashName() {
        return gcash_name;
    }

    public void setGCashName(String gcash_name) {
        this.gcash_name = gcash_name;
    }

    public void setGCashNumber(String gcash_number) {
        this.gcash_number = gcash_number;
    }

    public String getGCashNumber() {
        return gcash_number;
    }

    public LocalDateTime getDateTimeCreated() {
        return datetime_created;
    }

    public void setDateTimeCreated(LocalDateTime datetime_created) {
        this.datetime_created = datetime_created;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public void setCreditCardHolderName(String credit_card_holder_name) {
        this.credit_card_holder_name = credit_card_holder_name;
    }

    public String getCreditCardHolderName() {
        return credit_card_holder_name;
    }
}
