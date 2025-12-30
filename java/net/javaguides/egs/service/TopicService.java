package net.javaguides.egs.service;

import lombok.RequiredArgsConstructor;
import net.javaguides.egs.dto.TopicDTO;
import net.javaguides.egs.entity.Topic;
import net.javaguides.egs.repository.TopicRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Topic Service
 * Business logic for Topic operations
 */
@Service
@RequiredArgsConstructor
public class TopicService {
    
    private final TopicRepository topicRepository;
    
    /**
     * Get all topics
     */
    public List<TopicDTO> getAllTopics() {
        return topicRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all topics by subject id
     */
    public List<TopicDTO> getTopicsBySubject(Long subjectId) {
        return topicRepository.findBySubjectId(subjectId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get topic by id
     */
    public TopicDTO getTopicById(Long id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + id));
        return convertToDTO(topic);
    }
    
    /**
     * Get topic by id and subject id
     */
    public TopicDTO getTopicByIdAndSubject(Long id, Long subjectId) {
        Topic topic = topicRepository.findByIdAndSubjectId(id, subjectId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        return convertToDTO(topic);
    }
    
    /**
     * Create new topic
     */
    public TopicDTO createTopic(TopicDTO topicDTO) {
        Topic topic = new Topic();
        topic.setTitle(topicDTO.getTitle());
        topic.setDescription(topicDTO.getDescription());
        topic.setSubjectId(topicDTO.getSubjectId());
        
        Topic savedTopic = topicRepository.save(topic);
        return convertToDTO(savedTopic);
    }
    
    /**
     * Update existing topic
     */
    public TopicDTO updateTopic(Long id, TopicDTO topicDTO) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        
        if (topicDTO.getTitle() != null) {
            topic.setTitle(topicDTO.getTitle());
        }
        if (topicDTO.getDescription() != null) {
            topic.setDescription(topicDTO.getDescription());
        }
        
        Topic updatedTopic = topicRepository.save(topic);
        return convertToDTO(updatedTopic);
    }
    
    /**
     * Delete topic
     */
    public void deleteTopic(Long id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        topicRepository.delete(topic);
    }
    
    /**
     * Search topics by title
     */
    public List<TopicDTO> searchTopicsByTitle(String title) {
        return topicRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Convert Topic entity to TopicDTO
     */
    private TopicDTO convertToDTO(Topic topic) {
        return TopicDTO.builder()
                .id(topic.getId())
                .title(topic.getTitle())
                .description(topic.getDescription())
                .subjectId(topic.getSubjectId())
                .build();
    }
}
