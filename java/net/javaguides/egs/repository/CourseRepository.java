package net.javaguides.egs.repository;

import net.javaguides.egs.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Course Repository
 * Handles database operations for Course entity
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    // Find all courses by instructor
    List<Course> findByInstructorId(Long instructorId);
    
    // Find course by id and instructor id
    Optional<Course> findByIdAndInstructorId(Long id, Long instructorId);
    
    // Find all courses by title (partial match)
    List<Course> findByTitleContainingIgnoreCase(String title);
    
    // Find all courses by difficulty
    List<Course> findByDifficulty(String difficulty);
}
