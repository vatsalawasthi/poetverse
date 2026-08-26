package com.poetverse.controller;

import com.poetverse.dto.CollabRequestDTO;
import com.poetverse.dto.StanzaSubmissionDTO;
import com.poetverse.model.Collaboration;
import com.poetverse.service.CollaborationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collaborations")
@RequiredArgsConstructor
public class CollaborationController {

    private final CollaborationService collaborationService;

    @GetMapping
    public ResponseEntity<List<Collaboration>> getCollaborations(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(collaborationService.getCollaborations(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCollabById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(collaborationService.getById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createCollaboration(
            @RequestParam String userId,
            @RequestBody CollabRequestDTO request) {
        try {
            Collaboration created = collaborationService.createCollaboration(userId, request);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/stanza")
    public ResponseEntity<?> submitStanza(
            @PathVariable String id,
            @RequestParam String userId,
            @RequestBody StanzaSubmissionDTO dto) {
        try {
            Collaboration updated = collaborationService.submitStanza(id, userId, dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
