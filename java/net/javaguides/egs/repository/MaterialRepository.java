package net.javaguides.egs.repository;

import net.javaguides.egs.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Material Repository
 * Handles database operations for Material entity
 */
@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    
    // Find all materials by topic id
    List<Material> findByTopicId(Long topicId);
    
    // Find material by id and topic id
    Optional<Material> findByIdAndTopicId(Long id, Long topicId);
    
    // Find materials by type
    List<Material> findByType(String type);
    
    // Find materials by difficulty
    List<Material> findByDifficulty(String difficulty);
    
    // Find materials by title (partial match)
    List<Material> findByTitleContainingIgnoreCase(String title);
}
