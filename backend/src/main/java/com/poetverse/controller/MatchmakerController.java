package com.poetverse.controller;

import com.poetverse.dto.MatchScoreDTO;
import com.poetverse.service.MatchmakerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matchmaker")
@RequiredArgsConstructor
public class MatchmakerController {

    private final MatchmakerService matchmakerService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<MatchScoreDTO>> getMatchesForUser(@PathVariable String userId) {
        try {
            List<MatchScoreDTO> matches = matchmakerService.findMatchesForUser(userId);
            return ResponseEntity.ok(matches);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
