package net.javaguides.egs.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentDTO {
    private Long id;
    private String title;
    private String description;
    private String instructions;
    private LocalDateTime dueDate;
    private java.math.BigDecimal maxPoints;
    private String imageUrl;
    private String attachmentUrl;
    private Long courseId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}