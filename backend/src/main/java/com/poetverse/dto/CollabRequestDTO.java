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
public class CollabRequestDTO {
    private String title;
    private String promptOrTheme;
    private String genre;
    private String mood;
    private int maxStanzas;
    private String initialStanza;
    private List<String> invitedUsernames;
}
