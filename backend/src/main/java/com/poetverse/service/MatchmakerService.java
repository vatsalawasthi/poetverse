package com.poetverse.service;

import com.poetverse.dto.MatchScoreDTO;
import com.poetverse.model.User;
import com.poetverse.repository.PoemRepository;
import com.poetverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchmakerService {

    private final UserRepository userRepository;
    private final PoemRepository poemRepository;
    private final UserService userService;

    public List<MatchScoreDTO> findMatchesForUser(String currentUserId) {
        User currentUser = userService.getById(currentUserId);
        List<User> allUsers = userRepository.findAll();

        Set<String> myGenres = currentUser.getInterestGenres() != null 
                ? currentUser.getInterestGenres().stream().map(String::toLowerCase).collect(Collectors.toSet()) 
                : Set.of();
        Set<String> myThemes = currentUser.getFavoriteThemes() != null 
                ? currentUser.getFavoriteThemes().stream().map(String::toLowerCase).collect(Collectors.toSet()) 
                : Set.of();

        List<MatchScoreDTO> matches = new ArrayList<>();

        for (User other : allUsers) {
            if (other.getId().equals(currentUserId)) {
                continue;
            }

            Set<String> otherGenres = other.getInterestGenres() != null 
                    ? other.getInterestGenres().stream().map(String::toLowerCase).collect(Collectors.toSet()) 
                    : Set.of();
            Set<String> otherThemes = other.getFavoriteThemes() != null 
                    ? other.getFavoriteThemes().stream().map(String::toLowerCase).collect(Collectors.toSet()) 
                    : Set.of();

            // Calculate shared genres & themes
            List<String> sharedGenres = other.getInterestGenres() != null 
                    ? other.getInterestGenres().stream().filter(g -> myGenres.contains(g.toLowerCase())).collect(Collectors.toList())
                    : List.of();

            List<String> sharedThemes = other.getFavoriteThemes() != null 
                    ? other.getFavoriteThemes().stream().filter(t -> myThemes.contains(t.toLowerCase())).collect(Collectors.toList())
                    : List.of();

            // Jaccard similarity computation
            double genreScore = calculateJaccard(myGenres, otherGenres);
            double themeScore = calculateJaccard(myThemes, otherThemes);
            
            // Base compatibility score with bonus for shared elements
            int matchPercentage = (int) Math.round((genreScore * 0.55 + themeScore * 0.45) * 100);
            
            // Baseline affinity to ensure engaging matches
            if (matchPercentage < 35 && (!sharedGenres.isEmpty() || !sharedThemes.isEmpty())) {
                matchPercentage = 45 + (sharedGenres.size() * 15) + (sharedThemes.size() * 10);
            } else if (matchPercentage == 0) {
                matchPercentage = 30 + (other.getId().hashCode() % 15);
            }
            matchPercentage = Math.min(99, Math.max(25, matchPercentage));

            int poemCount = poemRepository.countByAuthorId(other.getId());
            boolean isFollowing = currentUser.getFollowing().contains(other.getId());

            matches.add(MatchScoreDTO.builder()
                    .userId(other.getId())
                    .username(other.getUsername())
                    .displayName(other.getDisplayName())
                    .avatar(other.getAvatar())
                    .bio(other.getBio())
                    .matchPercentage(matchPercentage)
                    .sharedGenres(sharedGenres)
                    .sharedThemes(sharedThemes)
                    .poemCount(poemCount)
                    .followerCount(other.getFollowers().size())
                    .isFollowing(isFollowing)
                    .build());
        }

        matches.sort((a, b) -> Integer.compare(b.getMatchPercentage(), a.getMatchPercentage()));
        return matches;
    }

    private double calculateJaccard(Set<String> setA, Set<String> setB) {
        if (setA.isEmpty() && setB.isEmpty()) return 0.0;
        Set<String> union = new HashSet<>(setA);
        union.addAll(setB);
        if (union.isEmpty()) return 0.0;

        Set<String> intersection = new HashSet<>(setA);
        intersection.retainAll(setB);
        return (double) intersection.size() / union.size();
    }
}
