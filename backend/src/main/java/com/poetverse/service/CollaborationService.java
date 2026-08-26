package com.poetverse.service;

import com.poetverse.dto.CollabRequestDTO;
import com.poetverse.dto.PoemRequestDTO;
import com.poetverse.dto.StanzaSubmissionDTO;
import com.poetverse.model.CollabStanza;
import com.poetverse.model.Collaboration;
import com.poetverse.model.Poem;
import com.poetverse.model.User;
import com.poetverse.repository.CollaborationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CollaborationService {

    private final CollaborationRepository collaborationRepository;
    private final UserService userService;
    private final PoemService poemService;

    public Collaboration createCollaboration(String userId, CollabRequestDTO request) {
        User user = userService.getById(userId);

        List<CollabStanza> stanzas = new ArrayList<>();
        if (request.getInitialStanza() != null && !request.getInitialStanza().isBlank()) {
            stanzas.add(CollabStanza.builder()
                    .id(UUID.randomUUID().toString())
                    .authorId(user.getId())
                    .authorUsername(user.getUsername())
                    .authorDisplayName(user.getDisplayName())
                    .authorAvatar(user.getAvatar())
                    .text(request.getInitialStanza().trim())
                    .orderIndex(1)
                    .status("APPROVED")
                    .submittedAt(Instant.now())
                    .build());
        }

        Collaboration collab = Collaboration.builder()
                .title(request.getTitle().trim())
                .promptOrTheme(request.getPromptOrTheme() != null ? request.getPromptOrTheme().trim() : "")
                .genre(request.getGenre() != null ? request.getGenre().trim() : "Free Verse")
                .mood(request.getMood() != null ? request.getMood().trim() : "Collaborative")
                .maxStanzas(request.getMaxStanzas() > 0 ? request.getMaxStanzas() : 4)
                .leadAuthorId(user.getId())
                .leadAuthorUsername(user.getUsername())
                .leadAuthorDisplayName(user.getDisplayName())
                .leadAuthorAvatar(user.getAvatar())
                .status("OPEN")
                .stanzas(stanzas)
                .invitedUsernames(request.getInvitedUsernames() != null ? request.getInvitedUsernames() : new ArrayList<>())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return collaborationRepository.save(collab);
    }

    public List<Collaboration> getCollaborations(String status) {
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            return collaborationRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase());
        }
        return collaborationRepository.findAllByOrderByCreatedAtDesc();
    }

    public Collaboration getById(String id) {
        return collaborationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Collaboration not found: " + id));
    }

    public Collaboration submitStanza(String collabId, String userId, StanzaSubmissionDTO dto) {
        Collaboration collab = getById(collabId);
        User user = userService.getById(userId);

        if ("COMPLETED".equalsIgnoreCase(collab.getStatus())) {
            throw new IllegalStateException("This collaboration is already completed.");
        }

        long approvedCount = collab.getStanzas().stream()
                .filter(s -> "APPROVED".equals(s.getStatus()))
                .count();

        if (approvedCount >= collab.getMaxStanzas()) {
            throw new IllegalStateException("Maximum stanza limit reached for this piece.");
        }

        CollabStanza stanza = CollabStanza.builder()
                .id(UUID.randomUUID().toString())
                .authorId(user.getId())
                .authorUsername(user.getUsername())
                .authorDisplayName(user.getDisplayName())
                .authorAvatar(user.getAvatar())
                .text(dto.getText().trim())
                .orderIndex((int) approvedCount + 1)
                .status("APPROVED") // Auto-approve or queue for lead approval
                .submittedAt(Instant.now())
                .build();

        collab.getStanzas().add(stanza);
        collab.setUpdatedAt(Instant.now());

        if (collab.getStanzas().stream().filter(s -> "APPROVED".equals(s.getStatus())).count() >= collab.getMaxStanzas()) {
            collab.setStatus("COMPLETED");
            // Auto publish to main feed as a finished collaborative masterpiece
            finalizeCollabIntoPoem(collab);
        } else {
            collab.setStatus("IN_PROGRESS");
        }

        return collaborationRepository.save(collab);
    }

    public Poem finalizeCollabIntoPoem(Collaboration collab) {
        // Collect all approved stanzas joined by double newlines
        String fullContent = collab.getStanzas().stream()
                .filter(s -> "APPROVED".equals(s.getStatus()))
                .map(CollabStanza::getText)
                .collect(Collectors.joining("\n\n"));

        // Collect distinct co-author display names
        List<String> coAuthors = collab.getStanzas().stream()
                .map(CollabStanza::getAuthorDisplayName)
                .distinct()
                .collect(Collectors.toList());

        PoemRequestDTO poemRequest = PoemRequestDTO.builder()
                .title(collab.getTitle())
                .content(fullContent)
                .genre(collab.getGenre())
                .mood(collab.getMood())
                .tags(List.of("Collaboration", "VerseCollab", collab.getGenre().toLowerCase()))
                .isCollabOpen(false)
                .collabMode("VERSE_COLLAB")
                .coAuthors(coAuthors)
                .build();

        Poem publishedPoem = poemService.createPoem(collab.getLeadAuthorId(), poemRequest);
        collab.setFinalizedPoemId(publishedPoem.getId());
        collab.setStatus("COMPLETED");
        collaborationRepository.save(collab);
        return publishedPoem;
    }
}
