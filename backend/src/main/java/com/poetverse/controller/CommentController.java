package com.poetverse.controller;

import com.poetverse.model.Comment;
import com.poetverse.service.CommentService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @Data
    public static class CommentRequest {
        private String poemId;
        private String userId;
        private String content;
        private Integer lineIndex;
    }

    @GetMapping("/poem/{poemId}")
    public ResponseEntity<List<Comment>> getCommentsForPoem(@PathVariable String poemId) {
        return ResponseEntity.ok(commentService.getCommentsForPoem(poemId));
    }

    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody CommentRequest request) {
        try {
            Comment comment = commentService.addComment(
                    request.getPoemId(),
                    request.getUserId(),
                    request.getContent(),
                    request.getLineIndex()
            );
            return ResponseEntity.ok(comment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
