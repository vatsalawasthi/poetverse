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
public class PoemRequestDTO {
    private String title;
    private String content;
    private String genre;
    private String mood;
    private List<String> tags;
    private boolean isCollabOpen;
    private String collabMode;
    private String parentPoemId;
    private List<String> coAuthors;
}
