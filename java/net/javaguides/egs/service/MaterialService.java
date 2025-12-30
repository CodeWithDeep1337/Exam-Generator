package net.javaguides.egs.service;

import lombok.RequiredArgsConstructor;
import net.javaguides.egs.dto.MaterialDTO;
import net.javaguides.egs.entity.Material;
import net.javaguides.egs.repository.MaterialRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Material Service
 * Business logic for Material operations and file uploads
 */
@Service
@RequiredArgsConstructor
public class MaterialService {
    
    private final MaterialRepository materialRepository;
    private static final String UPLOAD_DIR = "uploads/materials/";
    
    /**
     * Get all materials
     */
    public List<MaterialDTO> getAllMaterials() {
        return materialRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all materials by topic id
     */
    public List<MaterialDTO> getMaterialsByTopic(Long topicId) {
        return materialRepository.findByTopicId(topicId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get material by id
     */
    public MaterialDTO getMaterialById(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + id));
        return convertToDTO(material);
    }
    
    /**
     * Create new material
     */
    public MaterialDTO createMaterial(MaterialDTO materialDTO) {
        Material material = new Material();
        material.setTitle(materialDTO.getTitle());
        material.setDescription(materialDTO.getDescription());
        material.setType(materialDTO.getType());
        material.setFileUrl(materialDTO.getFileUrl());
        material.setLink(materialDTO.getLink());
        material.setDifficulty(materialDTO.getDifficulty() != null ? materialDTO.getDifficulty() : "BEGINNER");
        material.setTopicId(materialDTO.getTopicId());
        
        Material savedMaterial = materialRepository.save(material);
        return convertToDTO(savedMaterial);
    }
    
    /**
     * Update existing material
     */
    public MaterialDTO updateMaterial(Long id, MaterialDTO materialDTO) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        
        if (materialDTO.getTitle() != null) {
            material.setTitle(materialDTO.getTitle());
        }
        if (materialDTO.getDescription() != null) {
            material.setDescription(materialDTO.getDescription());
        }
        if (materialDTO.getType() != null) {
            material.setType(materialDTO.getType());
        }
        if (materialDTO.getFileUrl() != null) {
            material.setFileUrl(materialDTO.getFileUrl());
        }
        if (materialDTO.getLink() != null) {
            material.setLink(materialDTO.getLink());
        }
        if (materialDTO.getDifficulty() != null) {
            material.setDifficulty(materialDTO.getDifficulty());
        }
        
        Material updatedMaterial = materialRepository.save(material);
        return convertToDTO(updatedMaterial);
    }
    
    /**
     * Delete material
     */
    public void deleteMaterial(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        materialRepository.delete(material);
    }
    
    /**
     * Upload file
     */
    public String uploadFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        
        // Create upload directory if not exists
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String filename = System.currentTimeMillis() + "_" + originalFilename;
        Path filePath = uploadPath.resolve(filename);
        
        // Save file
        Files.copy(file.getInputStream(), filePath);
        
        // Return file URL
        return "/uploads/materials/" + filename;
    }
    
    /**
     * Get materials by type
     */
    public List<MaterialDTO> getMaterialsByType(String type) {
        return materialRepository.findByType(type)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get materials by difficulty
     */
    public List<MaterialDTO> getMaterialsByDifficulty(String difficulty) {
        return materialRepository.findByDifficulty(difficulty)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Search materials by title
     */
    public List<MaterialDTO> searchMaterialsByTitle(String title) {
        return materialRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Convert Material entity to MaterialDTO
     */
    private MaterialDTO convertToDTO(Material material) {
        return MaterialDTO.builder()
                .id(material.getId())
                .title(material.getTitle())
                .description(material.getDescription())
                .type(material.getType())
                .fileUrl(material.getFileUrl())
                .link(material.getLink())
                .difficulty(material.getDifficulty())
                .topicId(material.getTopicId())
                .createdAt(material.getCreatedAt())
                .updatedAt(material.getUpdatedAt())
                .build();
    }
}
