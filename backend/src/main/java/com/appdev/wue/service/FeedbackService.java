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
	private FeedbackRepository feedbackrepo;
	
	public List<FeedbackEntity> getAllFeedback(){
		return feedbackrepo.findAll();
	}
	
	public FeedbackEntity getFeedbackById(int id) {
		return feedbackrepo.findById(id).orElse(null);
	}
	
	public FeedbackEntity saveFeedback(FeedbackEntity feedback) {
		return feedbackrepo.save(feedback);
	}
	public String deleteFeedback(int id) {
		String msg="";
		if (feedbackrepo.findById((int) id).isPresent()) {
			feedbackrepo.deleteById( (int) id);
    		msg = "Feedback Successfully Deleted!!";
    	}else
    		msg = id + "NOT Found!";
    	return msg;
	}
	
	@SuppressWarnings("finally")
	public FeedbackEntity putFeedback(int id, FeedbackEntity newFeedback) {
		FeedbackEntity item = new FeedbackEntity();
    	try {
    		item = feedbackrepo.findById((int) id).get();
    		
    		item.setComment(newFeedback.getComment());
    		item.setRating(newFeedback.getRating());
    		item.setDatetime_created(newFeedback.getDatetime_created());
    	}catch(NoSuchElementException nex) {
    		throw new NameNotFoundException("Feedback" + id + "Not Found");
    	}finally {
    		return feedbackrepo.save(item);
    	}
    }
}

