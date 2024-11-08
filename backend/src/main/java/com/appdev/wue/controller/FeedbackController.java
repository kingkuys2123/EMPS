package com.appdev.wue.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
		return feedbackServ.createFeedback(feedback);
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
}
