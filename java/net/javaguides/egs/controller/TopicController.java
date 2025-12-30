package net.javaguides.egs.controller;

import lombok.RequiredArgsConstructor;
import net.javaguides.egs.dto.TopicDTO;
import net.javaguides.egs.service.TopicService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Topic Controller
 * REST API endpoints for Topic CRUD operations
 * Base URLs:
 *   - /api/courses/:courseId/subjects/:subjectId/topics
 *   - /api/topics
 */
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class TopicController {
    
    private final TopicService topicService;
    
    /**
     * GET /api/courses/:courseId/subjects/:subjectId/topics
     * Get all topics for a subject
     */
    @GetMapping("/api/courses/{courseId}/subjects/{subjectId}/topics")
    public ResponseEntity<?> getTopicsBySubject(
            @PathVariable Long courseId,
            @PathVariable Long subjectId) {
        try {
            List<TopicDTO> topics = topicService.getTopicsBySubject(subjectId);
            return ResponseEntity.ok(topics);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch topics", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * GET /api/topics/:id
     * Get topic by id
     */
    @GetMapping("/api/topics/{id}")
    public ResponseEntity<?> getTopicById(@PathVariable Long id) {
        try {
            TopicDTO topic = topicService.getTopicById(id);
            return ResponseEntity.ok(topic);
        } catch (RuntimeException e) {
            return buildErrorResponse("Topic not found", e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch topic", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * POST /api/topics
     * Create new topic
     */
    @PostMapping("/api/topics")
    public ResponseEntity<?> createTopic(@RequestBody TopicDTO topicDTO) {
        try {
            // Validate required fields
            if (topicDTO.getTitle() == null || topicDTO.getTitle().isEmpty()) {
                return buildErrorResponse("Validation Error", "Title is required", HttpStatus.BAD_REQUEST);
            }
            if (topicDTO.getDescription() == null || topicDTO.getDescription().isEmpty()) {
                return buildErrorResponse("Validation Error", "Description is required", HttpStatus.BAD_REQUEST);
            }
            if (topicDTO.getSubjectId() == null) {
                return buildErrorResponse("Validation Error", "Subject ID is required", HttpStatus.BAD_REQUEST);
            }
            
            TopicDTO createdTopic = topicService.createTopic(topicDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTopic);
        } catch (Exception e) {
            return buildErrorResponse("Failed to create topic", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * PUT /api/topics/:id
     * Update existing topic
     */
    @PutMapping("/api/topics/{id}")
    public ResponseEntity<?> updateTopic(@PathVariable Long id, @RequestBody TopicDTO topicDTO) {
        try {
            TopicDTO updatedTopic = topicService.updateTopic(id, topicDTO);
            return ResponseEntity.ok(updatedTopic);
        } catch (RuntimeException e) {
            return buildErrorResponse("Topic not found", e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to update topic", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * DELETE /api/topics/:id
     * Delete topic
     */
    @DeleteMapping("/api/topics/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable Long id) {
        try {
            topicService.deleteTopic(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Topic deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse("Topic not found", e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to delete topic", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * GET /api/topics/search
     * Search topics by title
     */
    @GetMapping("/api/topics/search")
    public ResponseEntity<?> searchTopics(@RequestParam String title) {
        try {
            List<TopicDTO> topics = topicService.searchTopicsByTitle(title);
            return ResponseEntity.ok(topics);
        } catch (Exception e) {
            return buildErrorResponse("Failed to search topics", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Helper method to build error response
     */
    private ResponseEntity<?> buildErrorResponse(String error, String message, HttpStatus status) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", error);
        errorResponse.put("message", message);
        return ResponseEntity.status(status).body(errorResponse);
    }
}
