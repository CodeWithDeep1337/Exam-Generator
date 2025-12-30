package net.javaguides.egs.controller;

import lombok.RequiredArgsConstructor;
import net.javaguides.egs.dto.SubjectDTO;
import net.javaguides.egs.service.SubjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Subject Controller
 * REST API endpoints for Subject CRUD operations
 * Base URL: /api/courses/:courseId/subjects
 */
@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class SubjectController {
    
    private final SubjectService subjectService;
    
    /**
     * GET /api/courses/:courseId/subjects
     * Get all subjects for a course
     */
    @GetMapping("/{courseId}/subjects")
    public ResponseEntity<?> getSubjectsByCourse(@PathVariable Long courseId) {
        try {
            List<SubjectDTO> subjects = subjectService.getSubjectsByCourse(courseId);
            return ResponseEntity.ok(subjects);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch subjects", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * GET /api/courses/:courseId/subjects/:id
     * Get subject by id
     */
    @GetMapping("/{courseId}/subjects/{id}")
    public ResponseEntity<?> getSubjectById(@PathVariable Long courseId, @PathVariable Long id) {
        try {
            SubjectDTO subject = subjectService.getSubjectByIdAndCourse(id, courseId);
            return ResponseEntity.ok(subject);
        } catch (RuntimeException e) {
            return buildErrorResponse("Subject not found", e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch subject", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * POST /api/courses/:courseId/subjects
     * Create new subject
     */
    @PostMapping("/{courseId}/subjects")
    public ResponseEntity<?> createSubject(@PathVariable Long courseId, @RequestBody SubjectDTO subjectDTO) {
        try {
            // Validate required fields
            if (subjectDTO.getName() == null || subjectDTO.getName().isEmpty()) {
                return buildErrorResponse("Validation Error", "Subject name is required", HttpStatus.BAD_REQUEST);
            }
            if (subjectDTO.getDescription() == null || subjectDTO.getDescription().isEmpty()) {
                return buildErrorResponse("Validation Error", "Description is required", HttpStatus.BAD_REQUEST);
            }
            
            SubjectDTO createdSubject = subjectService.createSubject(courseId, subjectDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSubject);
        } catch (Exception e) {
            return buildErrorResponse("Failed to create subject", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * PUT /api/courses/:courseId/subjects/:id
     * Update existing subject
     */
    @PutMapping("/{courseId}/subjects/{id}")
    public ResponseEntity<?> updateSubject(
            @PathVariable Long courseId,
            @PathVariable Long id,
            @RequestBody SubjectDTO subjectDTO) {
        try {
            SubjectDTO updatedSubject = subjectService.updateSubject(courseId, id, subjectDTO);
            return ResponseEntity.ok(updatedSubject);
        } catch (RuntimeException e) {
            return buildErrorResponse("Subject not found", e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to update subject", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * DELETE /api/courses/:courseId/subjects/:id
     * Delete subject
     */
    @DeleteMapping("/{courseId}/subjects/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable Long courseId, @PathVariable Long id) {
        try {
            subjectService.deleteSubject(courseId, id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Subject deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse("Subject not found", e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to delete subject", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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
