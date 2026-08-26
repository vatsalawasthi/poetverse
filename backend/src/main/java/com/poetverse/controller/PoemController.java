package com.poetverse.controller;

import com.poetverse.dto.PoemRequestDTO;
import com.poetverse.model.Poem;
import com.poetverse.service.PoemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/poems")
@RequiredArgsConstructor
public class PoemController {

    private final PoemService poemService;

    @GetMapping
    public ResponseEntity<List<Poem>> getFeed(
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(poemService.getFeed(filter, genre, userId, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPoemById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(poemService.getById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<Poem>> getPoemsByAuthor(@PathVariable String authorId) {
        return ResponseEntity.ok(poemService.getPoemsByAuthor(authorId));
    }

    @PostMapping
    public ResponseEntity<?> createPoem(@RequestParam String authorId, @RequestBody PoemRequestDTO request) {
        try {
            Poem created = poemService.createPoem(authorId, request);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePoem(
            @PathVariable String id,
            @RequestParam String userId,
            @RequestBody PoemRequestDTO request) {
        try {
            Poem updated = poemService.updatePoem(id, userId, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePoem(@PathVariable String id, @RequestParam String userId) {
        try {
            poemService.deletePoem(id, userId);
            return ResponseEntity.ok(Map.of("message", "Poem deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable String id, @RequestParam String userId) {
        try {
            Poem poem = poemService.toggleLike(id, userId);
            return ResponseEntity.ok(poem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
