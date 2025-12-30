package net.javaguides.egs.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicDTO {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private Long subjectId;
}
