package net.javaguides.egs.service;

import lombok.RequiredArgsConstructor;
import net.javaguides.egs.dto.SubjectDTO;
import net.javaguides.egs.entity.Subject;
import net.javaguides.egs.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Subject Service
 * Business logic for Subject operations
 */
@Service
@RequiredArgsConstructor
public class SubjectService {
    
    private final SubjectRepository subjectRepository;
    
    /**
     * Get all subjects
     */
    public List<SubjectDTO> getAllSubjects() {
        return subjectRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all subjects by course id
     */
    public List<SubjectDTO> getSubjectsByCourse(Long courseId) {
        return subjectRepository.findByCourseId(courseId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get subject by id
     */
    public SubjectDTO getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
        return convertToDTO(subject);
    }
    
    /**
     * Get subject by id and course id
     */
    public SubjectDTO getSubjectByIdAndCourse(Long id, Long courseId) {
        Subject subject = subjectRepository.findByIdAndCourseId(id, courseId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        return convertToDTO(subject);
    }
    
    /**
     * Create new subject
     */
    public SubjectDTO createSubject(Long courseId, SubjectDTO subjectDTO) {
        Subject subject = new Subject();
        subject.setName(subjectDTO.getName());
        subject.setDescription(subjectDTO.getDescription());
        subject.setCourseId(courseId);
        
        Subject savedSubject = subjectRepository.save(subject);
        return convertToDTO(savedSubject);
    }
    
    /**
     * Update existing subject
     */
    public SubjectDTO updateSubject(Long courseId, Long id, SubjectDTO subjectDTO) {
        Subject subject = subjectRepository.findByIdAndCourseId(id, courseId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        
        if (subjectDTO.getName() != null) {
            subject.setName(subjectDTO.getName());
        }
        if (subjectDTO.getDescription() != null) {
            subject.setDescription(subjectDTO.getDescription());
        }
        
        Subject updatedSubject = subjectRepository.save(subject);
        return convertToDTO(updatedSubject);
    }
    
    /**
     * Delete subject
     */
    public void deleteSubject(Long courseId, Long id) {
        Subject subject = subjectRepository.findByIdAndCourseId(id, courseId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        subjectRepository.delete(subject);
    }
    
    /**
     * Search subjects by name
     */
    public List<SubjectDTO> searchSubjectsByName(String name) {
        return subjectRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Convert Subject entity to SubjectDTO
     */
    private SubjectDTO convertToDTO(Subject subject) {
        return SubjectDTO.builder()
                .id(subject.getId())
                .name(subject.getName())
                .description(subject.getDescription())
                .courseId(subject.getCourseId())
                .createdAt(subject.getCreatedAt())
                .updatedAt(subject.getUpdatedAt())
                .build();
    }
}
