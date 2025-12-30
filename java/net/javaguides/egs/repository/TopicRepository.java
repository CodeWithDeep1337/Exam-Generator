package net.javaguides.egs.repository;

import net.javaguides.egs.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Topic Repository
 * Handles database operations for Topic entity
 */
@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    
    // Find all topics by subject id
    List<Topic> findBySubjectId(Long subjectId);
    
    // Find topic by id and subject id
    Optional<Topic> findByIdAndSubjectId(Long id, Long subjectId);
    
    // Find topics by title (partial match)
    List<Topic> findByTitleContainingIgnoreCase(String title);
}
