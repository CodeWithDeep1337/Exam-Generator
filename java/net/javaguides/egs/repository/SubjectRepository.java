package net.javaguides.egs.repository;

import net.javaguides.egs.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Subject Repository
 * Handles database operations for Subject entity
 */
@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    
    // Find all subjects by course id
    List<Subject> findByCourseId(Long courseId);
    
    // Find subject by id and course id
    Optional<Subject> findByIdAndCourseId(Long id, Long courseId);
    
    // Find subjects by name (partial match)
    List<Subject> findByNameContainingIgnoreCase(String name);
}
