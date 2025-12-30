package net.javaguides.egs.service;

import lombok.RequiredArgsConstructor;
import net.javaguides.egs.dto.CourseDTO;
import net.javaguides.egs.entity.Course;
import net.javaguides.egs.repository.CourseRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Course Service
 * Business logic for Course operations
 */
@Service
@RequiredArgsConstructor
public class CourseService {
    
    private final CourseRepository courseRepository;
    
    /**
     * Get all courses
     */
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all courses by instructor
     */
    public List<CourseDTO> getCoursesByInstructor(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get course by id
     */
    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        return convertToDTO(course);
    }
    
    /**
     * Create new course
     */
    public CourseDTO createCourse(CourseDTO courseDTO, Long instructorId) {
        Course course = new Course();
        course.setTitle(courseDTO.getTitle());
        course.setDescription(courseDTO.getDescription());
        course.setDifficulty(courseDTO.getDifficulty() != null ? courseDTO.getDifficulty() : "BEGINNER");
        course.setInstructorId(instructorId);
        
        Course savedCourse = courseRepository.save(course);
        return convertToDTO(savedCourse);
    }
    
    /**
     * Update existing course
     */
    public CourseDTO updateCourse(Long id, CourseDTO courseDTO, Long instructorId) {
        Course course = courseRepository.findByIdAndInstructorId(id, instructorId)
                .orElseThrow(() -> new RuntimeException("Course not found or unauthorized"));
        
        if (courseDTO.getTitle() != null) {
            course.setTitle(courseDTO.getTitle());
        }
        if (courseDTO.getDescription() != null) {
            course.setDescription(courseDTO.getDescription());
        }
        if (courseDTO.getDifficulty() != null) {
            course.setDifficulty(courseDTO.getDifficulty());
        }
        
        Course updatedCourse = courseRepository.save(course);
        return convertToDTO(updatedCourse);
    }
    
    /**
     * Delete course
     */
    public void deleteCourse(Long id, Long instructorId) {
        Course course = courseRepository.findByIdAndInstructorId(id, instructorId)
                .orElseThrow(() -> new RuntimeException("Course not found or unauthorized"));
        courseRepository.delete(course);
    }
    
    /**
     * Search courses by title
     */
    public List<CourseDTO> searchCoursesByTitle(String title) {
        return courseRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get courses by difficulty
     */
    public List<CourseDTO> getCoursesByDifficulty(String difficulty) {
        return courseRepository.findByDifficulty(difficulty)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Convert Course entity to CourseDTO
     */
    private CourseDTO convertToDTO(Course course) {
        return CourseDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .difficulty(course.getDifficulty())
                .instructorId(course.getInstructorId())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}
