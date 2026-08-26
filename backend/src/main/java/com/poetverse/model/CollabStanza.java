package com.poetverse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollabStanza {
    private String id;
    private String authorId;
    private String authorUsername;
    private String authorDisplayName;
    private String authorAvatar;
    private String text;
    private int orderIndex;
    
    @Builder.Default
    private String status = "APPROVED"; // "PENDING", "APPROVED", "REJECTED"
    
    @Builder.Default
    private Instant submittedAt = Instant.now();
}
