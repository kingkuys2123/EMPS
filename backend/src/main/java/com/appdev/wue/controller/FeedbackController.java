package com.appdev.wue.controller;

import java.time.LocalDateTime;
import java.util.List;

import com.appdev.wue.entity.EventEntity;
import com.appdev.wue.entity.UserEntity;
import com.appdev.wue.repository.EventRepository;
import com.appdev.wue.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.appdev.wue.entity.FeedbackEntity;
import com.appdev.wue.service.FeedbackService;


@RestController
@RequestMapping(method = RequestMethod.GET, path = "/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackServ;

    // Create Feedback
    @PostMapping("/createFeedback")
    public FeedbackEntity createFeedback(@RequestBody FeedbackEntity feedback) {
        feedback.setDatetime_created(LocalDateTime.now());
        return feedbackServ.createFeedback(feedback);
    }

    @PostMapping("/createFeedbackByUserAndEvent")
    public ResponseEntity<?> createFeedbackByUserAndEvent(@RequestParam int user_id, @RequestParam int event_id, @RequestBody FeedbackEntity feedback) {
        try {
            FeedbackEntity createdFeedback = feedbackServ.createFeedbackByUserAndEvent(user_id, event_id, feedback);
            return ResponseEntity.ok(createdFeedback);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating feedback: " + e.getMessage());
        }
    }

    // Get All Feedbacks
    @GetMapping("/getAllFeedbacks")
	public List<FeedbackEntity> getAllFeedbacks() {
        return feedbackServ.getAllFeedbacks();
    }	

    // Get Feedback by Id
    @GetMapping("/getFeedback")
	public FeedbackEntity getFeedback(@RequestParam int id) {
		return feedbackServ.getFeedback(id);
	}

    // Update Feedback
    @PutMapping("/updateFeedback")
	public FeedbackEntity updateFeedback(@RequestParam int id, @RequestBody FeedbackEntity newFeedback) {
    	return feedbackServ.updateFeedback(id, newFeedback);
    }

    // Delete Feedback
    @DeleteMapping("/deleteFeedback/{id}")
    public String deleteFeedback(@PathVariable int id) {
        return feedbackServ.deleteFeedback(id);
    }

    @GetMapping("/getFeedbacksByEvent")
    public List<FeedbackEntity> getFeedbacksByEvent(@RequestParam int id) {
        return feedbackServ.getFeedbacksByEvent(id);
    }

    @GetMapping("/getFeedbackByUserAndEvent")
    public FeedbackEntity getFeedbackByUserAndEvent(@RequestParam int user_id, @RequestParam int event_id) {
        return feedbackServ.getFeedbackByUserAndEvent(user_id, event_id);
    }

    @PutMapping("/updateFeedbackByUserAndEvent")
    public FeedbackEntity updateFeedbackByUserAndEvent(@RequestParam int user_id, @RequestParam int event_id, @RequestBody FeedbackEntity newFeedback) {
        return feedbackServ.updateFeedbackByUserAndEvent(user_id, event_id, newFeedback);
    }

    @GetMapping("/findByUserIdAndEventId")
    public boolean findByUserIdAndEventId(@RequestParam int user_id, @RequestParam int event_id) {
        return feedbackServ.findByUserIdAndEventId(user_id, event_id);
    }

}
