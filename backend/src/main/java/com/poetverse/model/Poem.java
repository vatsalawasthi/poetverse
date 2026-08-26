package com.poetverse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "poems")
public class Poem {
    @Id
    private String id;

    private String title;
    private String content; // full text with stanzas preserved
    private String genre;   // Haiku, Sonnet, Free Verse, Ghazal, Spoken Word, Ballad, Limerick, Blank Verse, etc.
    private String mood;    // Melancholy, Serene, Passionate, Nostalgic, Hopeful, Mystic, etc.
    
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    private String authorId;
    private String authorUsername;
    private String authorDisplayName;
    private String authorAvatar;

    // Social metrics
    @Builder.Default
    private Set<String> likedBy = new HashSet<>(); // userIds
    
    @Builder.Default
    private int likesCount = 0;

    @Builder.Default
    private int commentsCount = 0;

    // Collaboration attributes
    @Builder.Default
    private boolean isCollabOpen = false;

    private String collabMode; // "ADD_STANZA", "ALTERNATE_LINES", "FORK_REMIX", "NONE"
    
    private String parentPoemId; // If this poem was forked or co-authored from another

    @Builder.Default
    private List<String> coAuthors = new ArrayList<>(); // list of participating author usernames

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private Instant updatedAt = Instant.now();
}
