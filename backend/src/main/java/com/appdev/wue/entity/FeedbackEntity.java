package com.appdev.wue.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class FeedbackEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int feedback_id;
    private String comment;
    private int rating;
    private LocalDateTime datetime_created;

    public int getFeedback_id() {
        return feedback_id;
    }
    public void setFeedback_id(int feedback_id) {
        this.feedback_id = feedback_id;
    }
    public String getComment() {
        return comment;
    }
    public void setComment(String comment) {
        this.comment = comment;
    }
    public int getRating() {
        return rating;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }
    public LocalDateTime getDatetime_created() {
        return datetime_created;
    }
    public void setDatetime_created(LocalDateTime datetime_created) {
        this.datetime_created = datetime_created;
    }

}