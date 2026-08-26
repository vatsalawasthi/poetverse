package com.poetverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchScoreDTO {
    private String userId;
    private String username;
    private String displayName;
    private String avatar;
    private String bio;
    private int matchPercentage; // e.g. 94%
    private List<String> sharedGenres;
    private List<String> sharedThemes;
    private int poemCount;
    private int followerCount;
    private boolean isFollowing;
}
