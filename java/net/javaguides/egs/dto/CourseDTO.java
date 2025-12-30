package net.javaguides.egs.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * Course DTO
 * Data Transfer Object for Course entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private Long instructorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
