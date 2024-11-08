package com.appdev.wue.service;

import java.util.List;
import java.util.NoSuchElementException;
import javax.naming.NameNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.wue.entity.FeedbackEntity;
import com.appdev.wue.repository.FeedbackRepository;

@Service
public class FeedbackService {

	@Autowired 
	private FeedbackRepository feedbackRepo;

	// Get All Feedbacks
	public List<FeedbackEntity> getAllFeedbacks(){
		return feedbackRepo.findAll();
	}

	// Get Feedback by Id
	public FeedbackEntity getFeedback(int id) {
		return feedbackRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Feedback with ID " + id + " not found!"));
	}

	// Create Feedback
	public FeedbackEntity createFeedback(FeedbackEntity feedback) {
		return feedbackRepo.save(feedback);
	}

	// Delete Feedback
	public String deleteFeedback(int id) {
		String msg = "";
		try {
			if (feedbackRepo.findById(id).isPresent()) {
				feedbackRepo.deleteById(id);
				msg = "Feedback deleted successfully!";
			} else {
				msg = id + "Feedback not found!";
			}
		} catch (Exception e) {
			msg = "Error occurred while deleting the feedback with ID " + id + ": " + e.getMessage();
		}
		return msg;
	}

	// Update Feedback
	@SuppressWarnings("finally")
	public FeedbackEntity updateFeedback(int id, FeedbackEntity newFeedback) {
		FeedbackEntity item = new FeedbackEntity();
    	try {
    		item = feedbackRepo.findById(id).get();
    		
    		item.setComment(newFeedback.getComment());
    		item.setRating(newFeedback.getRating());
    		item.setDatetime_created(newFeedback.getDatetime_created());
    	}catch(NoSuchElementException nex) {
    		throw new NameNotFoundException("Feedback" + id + "Not Found");
    	}finally {
    		return feedbackRepo.save(item);
    	}
    }
}

