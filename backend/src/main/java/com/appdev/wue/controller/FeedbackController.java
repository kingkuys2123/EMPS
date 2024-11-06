package com.appdev.wue.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.wue.entity.FeedbackEntity;
import com.appdev.wue.service.FeedbackService;


@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackServ;

    @PostMapping("/postFeedback")
    public FeedbackEntity createFeedback(@RequestBody FeedbackEntity feedback) {
		return feedbackServ.saveFeedback(feedback);
	}

    @GetMapping("/getAllFeedback")
	public List<FeedbackEntity> getAllFeedback() {
        return feedbackServ.getAllFeedback();
    }	
    
    @GetMapping("/getFeedback")
	public FeedbackEntity getFeedback(@RequestParam int id) {
		FeedbackEntity feedback = feedbackServ.getFeedbackById(id);
		return feedback;
	}

    @PutMapping("/putFeedback")
	public FeedbackEntity putFeedback(@RequestParam int id, @RequestBody FeedbackEntity newFeedback) {
    	return feedbackServ.putFeedback(id, newFeedback);
    }

    @DeleteMapping("/deleteFeedback/{id}")
    public String deleteFeedback(@PathVariable int id) {
        return feedbackServ.deleteFeedback(id);
    }
}
