package com.poetverse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String displayName;
    private String bio;
    private String avatar;
    private String location;

    private String resetPasswordToken;
    private Instant resetPasswordTokenExpiry;
    private String recoveryCode;

    @Builder.Default
    private List<String> interestGenres = List.of();

    @Builder.Default
    private List<String> favoriteThemes = List.of();

    @Builder.Default
    private Set<String> followers = new HashSet<>();

    @Builder.Default
    private Set<String> following = new HashSet<>();

    @Builder.Default
    private Set<String> bookmarkedPoemIds = new HashSet<>();

    @Builder.Default
    private List<String> badges = List.of();

    @Builder.Default
    private Instant createdAt = Instant.now();
}
