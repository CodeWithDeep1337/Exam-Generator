package net.javaguides.egs.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * Subject DTO
 * Data Transfer Object for Subject entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectDTO {
    private Long id;
    private String name;
    private String description;
    private Long courseId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
