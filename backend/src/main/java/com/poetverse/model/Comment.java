package com.poetverse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "comments")
public class Comment {
    @Id
    private String id;

    private String poemId;

    private String userId;
    private String username;
    private String displayName;
    private String userAvatar;

    private String content;

    // Optional line index for inline poetic margin annotations
    private Integer lineIndex;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
