package com.poetverse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "collaborations")
public class Collaboration {
    @Id
    private String id;

    private String title;
    private String promptOrTheme;
    private String genre;
    private String mood;
    private int maxStanzas;

    private String leadAuthorId;
    private String leadAuthorUsername;
    private String leadAuthorDisplayName;
    private String leadAuthorAvatar;

    @Builder.Default
    private String status = "OPEN"; // "OPEN", "IN_PROGRESS", "COMPLETED"

    @Builder.Default
    private List<CollabStanza> stanzas = new ArrayList<>();

    @Builder.Default
    private List<String> invitedUsernames = new ArrayList<>();

    private String finalizedPoemId; // Reference to published poem when completed

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private Instant updatedAt = Instant.now();
}
