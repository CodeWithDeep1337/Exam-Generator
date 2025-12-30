package net.javaguides.egs.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDTO {
    private Long id;
    private String title;
    private String description;
    private String type;
    private String fileUrl;
    private String imageUrl;
    private String link;
    private String difficulty;
    private Long topicId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
