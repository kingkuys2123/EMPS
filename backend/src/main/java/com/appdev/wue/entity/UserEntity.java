package com.appdev.wue.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "user")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int user_id;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "first_name")
    private String first_name;

    @Column(name = "last_name")
    private String last_name;

    @Column(name = "account_type")
    private String account_type;

    @Column(name = "phone_number")
    private String phone_number;

    @Column(name = "datetime_created")
    private LocalDateTime datetime_created;

    @Column(name = "profile_picture")
    private String profile_picture;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<BookingEntity> bookings;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<FeedbackEntity> feedbacks;

    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private OrganizerEntity organizer;

    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private PaymentMethodEntity payment_method;

    public int getUserID() {
        return user_id;
    }

    public void setUserID(int user_id) {
        this.user_id = user_id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return first_name;
    }

    public void setFirstName(String first_name) {
        this.first_name = first_name;
    }

    public String getLastName() {
        return last_name;
    }

    public void setLastName(String last_name) {
        this.last_name = last_name;
    }

    public String getAccountType() {
        return account_type;
    }

    public void setAccountType(String account_type) {
        this.account_type = account_type;
    }

    public String getPhoneNumber() {
        return phone_number;
    }

    public void setPhoneNumber(String phone_number) {
        this.phone_number = phone_number;
    }

    public LocalDateTime getDateTimeCreated() {
        return datetime_created;
    }

    public void setDateTimeCreated(LocalDateTime datetime_created) {
        this.datetime_created = datetime_created;
    }

    public List<BookingEntity> getBookings() {
        return bookings;
    }

    public void setBookings(List<BookingEntity> bookings) {
        this.bookings = bookings;
    }

    public List<FeedbackEntity> getFeedbacks() {
        return feedbacks;
    }

    public void setFeedbacks(List<FeedbackEntity> feedbacks) {
        this.feedbacks = feedbacks;
    }

    public OrganizerEntity getOrganizer() {
        return organizer;
    }

    public void setOrganizer(OrganizerEntity organizer) {
        this.organizer = organizer;
    }

    public PaymentMethodEntity getPaymentMethod() {
        return payment_method;
    }

    public void setPaymentMethod(PaymentMethodEntity payment_details) {
        this.payment_method = payment_details;
    }

    public String getProfilePicture() {
        return profile_picture;
    }

    public void setProfilePicture(String profile_picture) {
        this.profile_picture = profile_picture;
    }
}
