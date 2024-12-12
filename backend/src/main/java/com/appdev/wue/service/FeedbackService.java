package com.appdev.wue.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import javax.naming.NameNotFoundException;

import com.appdev.wue.entity.EventEntity;
import com.appdev.wue.entity.UserEntity;
import com.appdev.wue.repository.EventRepository;
import com.appdev.wue.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.wue.entity.FeedbackEntity;
import com.appdev.wue.repository.FeedbackRepository;

@Service
public class FeedbackService {

	@Autowired 
	private FeedbackRepository feedbackRepo;

	@Autowired
	private EventRepository eventRepo;

	@Autowired
	private UserRepository userRepo;

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

	public FeedbackEntity createFeedbackByUserAndEvent(int user_id, int event_id, FeedbackEntity feedback) {
		try {
			UserEntity user = userRepo.findById(user_id).orElseThrow(() -> new NoSuchElementException("User not found with ID: " + user_id));
			EventEntity event = eventRepo.findById(event_id).orElseThrow(() -> new NoSuchElementException("Event not found with ID: " + event_id));

			// Check if feedback already exists for the same user and event
			List<FeedbackEntity> existingFeedbacks = feedbackRepo.findByUserIdAndEventId(user_id, event_id);
			if (!existingFeedbacks.isEmpty()) {
				throw new RuntimeException("You have already submitted a feedback for this event!");
			}

			feedback.setUser(user);
			feedback.setEvent(event);
			feedback.setDatetime_created(LocalDateTime.now());
			return feedbackRepo.save(feedback);
		} catch (NoSuchElementException e) {
			throw new RuntimeException("Error creating feedback: " + e.getMessage(), e);
		}
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

	public List<FeedbackEntity> getFeedbacksByEvent(int id) {
		try {
			return feedbackRepo.findFeedbacksByEventIdWithUser(id);
		} catch (Exception e) {
			throw new RuntimeException("Error retrieving feedbacks for event ID " + id, e);
		}
	}

	public FeedbackEntity getFeedbackByUserAndEvent(int user_id, int eventId) {
		try {
			List<FeedbackEntity> feedbacks = feedbackRepo.findByUserIdAndEventId(user_id, eventId);
			if (feedbacks.isEmpty()) {
				throw new NoSuchElementException("Feedback not found for user ID " + user_id + " and event ID " + eventId);
			}
			return feedbacks.get(0);
		} catch (NoSuchElementException e) {
			throw new RuntimeException("Error retrieving feedback for user ID " + user_id + " and event ID " + eventId, e);
		}
	}

	public FeedbackEntity updateFeedbackByUserAndEvent(int userId, int eventId, FeedbackEntity newFeedback) {
		try {
			FeedbackEntity feedback = getFeedbackByUserAndEvent(userId, eventId);
			feedback.setComment(newFeedback.getComment());
			feedback.setRating(newFeedback.getRating());
			return feedbackRepo.save(feedback);
		} catch (NoSuchElementException e) {
			throw new RuntimeException("Error updating feedback for user ID " + userId + " and event ID " + eventId, e);
		}
	}

	public boolean findByUserIdAndEventId(int user_id, int event_id) {
		List<FeedbackEntity> feedbacks = feedbackRepo.findByUserIdAndEventId(user_id, event_id);
		return !feedbacks.isEmpty();
	}
}

