package net.javaguides.egs.controller;

import lombok.RequiredArgsConstructor;
import net.javaguides.egs.User;
import net.javaguides.egs.UserRepository;
import net.javaguides.egs.dto.CourseDTO;
import net.javaguides.egs.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class CourseController {
    
    private final CourseService courseService;
    private final UserRepository userRepository;
    

    @GetMapping
    public ResponseEntity<?> getAllCourses(Authentication authentication) {
        try {
            String email = authentication.getName();
            Long instructorId = getInstructorIdFromAuth(email);
            
            List<CourseDTO> courses = courseService.getCoursesByInstructor(instructorId);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch courses", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * GET /api/courses/:id
     * Get course by id
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        try {
            CourseDTO course = courseService.getCourseById(id);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return buildErrorResponse("Course not found", e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch course", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * POST /api/courses
     * Create new course
     */
    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody CourseDTO courseDTO, Authentication authentication) {
        try {
            String email = authentication.getName();
            Long instructorId = getInstructorIdFromAuth(email);
            
            // Validate required fields
            if (courseDTO.getTitle() == null || courseDTO.getTitle().isEmpty()) {
                return buildErrorResponse("Validation Error", "Title is required", HttpStatus.BAD_REQUEST);
            }
            if (courseDTO.getDescription() == null || courseDTO.getDescription().isEmpty()) {
                return buildErrorResponse("Validation Error", "Description is required", HttpStatus.BAD_REQUEST);
            }
            
            CourseDTO createdCourse = courseService.createCourse(courseDTO, instructorId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
        } catch (Exception e) {
            return buildErrorResponse("Failed to create course", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * PUT /api/courses/:id
     * Update existing course
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(
            @PathVariable Long id,
            @RequestBody CourseDTO courseDTO,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            Long instructorId = getInstructorIdFromAuth(email);
            
            CourseDTO updatedCourse = courseService.updateCourse(id, courseDTO, instructorId);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            return buildErrorResponse("Course not found or unauthorized", e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to update course", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * DELETE /api/courses/:id
     * Delete course
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            Long instructorId = getInstructorIdFromAuth(email);
            
            courseService.deleteCourse(id, instructorId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Course deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse("Course not found or unauthorized", e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to delete course", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * GET /api/courses/search
     * Search courses by title
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchCourses(@RequestParam String title) {
        try {
            List<CourseDTO> courses = courseService.searchCoursesByTitle(title);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return buildErrorResponse("Failed to search courses", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * GET /api/courses/difficulty/:difficulty
     * Get courses by difficulty
     */
    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<?> getCoursesByDifficulty(@PathVariable String difficulty) {
        try {
            List<CourseDTO> courses = courseService.getCoursesByDifficulty(difficulty);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch courses", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Helper method to get instructor ID from authentication
     * Looks up the user in the database by email
     */
    private Long getInstructorIdFromAuth(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return user.getId();
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
