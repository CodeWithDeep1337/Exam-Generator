package net.javaguides.egs.controller;

import lombok.RequiredArgsConstructor;
import net.javaguides.egs.dto.MaterialDTO;
import net.javaguides.egs.service.MaterialService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Material Controller
 * REST API endpoints for Material CRUD operations and file uploads
 * Base URLs:
 *   - /api/topics/:topicId/materials
 *   - /api/materials
 *   - /api/materials/upload
 */
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class MaterialController {
    
    private final MaterialService materialService;
    
    /**
     * GET /api/topics/:topicId/materials
     * Get all materials for a topic
     */
    @GetMapping("/api/topics/{topicId}/materials")
    public ResponseEntity<?> getMaterialsByTopic(@PathVariable Long topicId) {
        try {
            List<MaterialDTO> materials = materialService.getMaterialsByTopic(topicId);
            return ResponseEntity.ok(materials);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch materials", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * GET /api/materials/:id
     * Get material by id
     */
    @GetMapping("/api/materials/{id}")
    public ResponseEntity<?> getMaterialById(@PathVariable Long id) {
        try {
            MaterialDTO material = materialService.getMaterialById(id);
            return ResponseEntity.ok(material);
        } catch (RuntimeException e) {
            return buildErrorResponse("Material not found", e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch material", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * POST /api/materials
     * Create new material
     */
    @PostMapping("/api/materials")
    public ResponseEntity<?> createMaterial(@RequestBody MaterialDTO materialDTO) {
        try {
            // Validate required fields
            if (materialDTO.getTitle() == null || materialDTO.getTitle().isEmpty()) {
                return buildErrorResponse("Validation Error", "Title is required", HttpStatus.BAD_REQUEST);
            }
            if (materialDTO.getType() == null || materialDTO.getType().isEmpty()) {
                return buildErrorResponse("Validation Error", "Type is required", HttpStatus.BAD_REQUEST);
            }
            if (materialDTO.getTopicId() == null) {
                return buildErrorResponse("Validation Error", "Topic ID is required", HttpStatus.BAD_REQUEST);
            }
            
            // Type-specific validation
            if ("link".equalsIgnoreCase(materialDTO.getType())) {
                if (materialDTO.getLink() == null || materialDTO.getLink().isEmpty()) {
                    return buildErrorResponse("Validation Error", "Link is required for link type", HttpStatus.BAD_REQUEST);
                }
            }
            
            MaterialDTO createdMaterial = materialService.createMaterial(materialDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMaterial);
        } catch (Exception e) {
            return buildErrorResponse("Failed to create material", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * PUT /api/materials/:id
     * Update existing material
     */
    @PutMapping("/api/materials/{id}")
    public ResponseEntity<?> updateMaterial(@PathVariable Long id, @RequestBody MaterialDTO materialDTO) {
        try {
            MaterialDTO updatedMaterial = materialService.updateMaterial(id, materialDTO);
            return ResponseEntity.ok(updatedMaterial);
        } catch (RuntimeException e) {
            return buildErrorResponse("Material not found", e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to update material", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * DELETE /api/materials/:id
     * Delete material
     */
    @DeleteMapping("/api/materials/{id}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Long id) {
        try {
            materialService.deleteMaterial(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Material deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse("Material not found", e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to delete material", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * POST /api/materials/upload
     * Upload file
     */
    @PostMapping("/api/materials/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return buildErrorResponse("Validation Error", "File is empty", HttpStatus.BAD_REQUEST);
            }
            
            String fileUrl = materialService.uploadFile(file);
            
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("filename", file.getOriginalFilename());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            return buildErrorResponse("Failed to upload file", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return buildErrorResponse("Upload error", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * GET /api/materials/type/:type
     * Get materials by type
     */
    @GetMapping("/api/materials/type/{type}")
    public ResponseEntity<?> getMaterialsByType(@PathVariable String type) {
        try {
            List<MaterialDTO> materials = materialService.getMaterialsByType(type);
            return ResponseEntity.ok(materials);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch materials", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * GET /api/materials/difficulty/:difficulty
     * Get materials by difficulty
     */
    @GetMapping("/api/materials/difficulty/{difficulty}")
    public ResponseEntity<?> getMaterialsByDifficulty(@PathVariable String difficulty) {
        try {
            List<MaterialDTO> materials = materialService.getMaterialsByDifficulty(difficulty);
            return ResponseEntity.ok(materials);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch materials", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * GET /api/materials/search
     * Search materials by title
     */
    @GetMapping("/api/materials/search")
    public ResponseEntity<?> searchMaterials(@RequestParam String title) {
        try {
            List<MaterialDTO> materials = materialService.searchMaterialsByTitle(title);
            return ResponseEntity.ok(materials);
        } catch (Exception e) {
            return buildErrorResponse("Failed to search materials", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * GET /api/materials/download/:filename
     * Download material file with proper content-type headers
     */
    @GetMapping("/api/materials/download/{filename}")
    public ResponseEntity<?> downloadFile(@PathVariable String filename) {
        try {
            // Prevent directory traversal attacks
            if (filename.contains("..") || filename.contains("/")) {
                return buildErrorResponse("Invalid filename", "Invalid file path", HttpStatus.BAD_REQUEST);
            }
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Use the fileUrl directly for downloads. Files are served with proper content-type headers.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse("Download error", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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
