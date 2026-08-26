package com.poetverse.service;

import com.poetverse.dto.PoemRequestDTO;
import com.poetverse.model.Poem;
import com.poetverse.model.User;
import com.poetverse.repository.CommentRepository;
import com.poetverse.repository.PoemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PoemService {

    private final PoemRepository poemRepository;
    private final UserService userService;
    private final CommentRepository commentRepository;

    public Poem createPoem(String authorId, PoemRequestDTO request) {
        User author = userService.getById(authorId);

        Poem poem = Poem.builder()
                .title(request.getTitle().trim())
                .content(request.getContent().trim())
                .genre(request.getGenre() != null ? request.getGenre().trim() : "Free Verse")
                .mood(request.getMood() != null ? request.getMood().trim() : "Reflective")
                .tags(request.getTags() != null ? request.getTags() : new ArrayList<>())
                .authorId(author.getId())
                .authorUsername(author.getUsername())
                .authorDisplayName(author.getDisplayName())
                .authorAvatar(author.getAvatar())
                .likedBy(new HashSet<>())
                .likesCount(0)
                .commentsCount(0)
                .isCollabOpen(request.isCollabOpen())
                .collabMode(request.getCollabMode() != null ? request.getCollabMode() : "NONE")
                .parentPoemId(request.getParentPoemId())
                .coAuthors(request.getCoAuthors() != null ? request.getCoAuthors() : new ArrayList<>())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return poemRepository.save(poem);
    }

    public Poem getById(String id) {
        return poemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Poem not found: " + id));
    }

    public List<Poem> getFeed(String filter, String genre, String currentUserId, String search) {
        if (search != null && !search.isBlank()) {
            return poemRepository.searchPoems(search.trim());
        }

        if (genre != null && !genre.isBlank() && !genre.equalsIgnoreCase("All")) {
            return poemRepository.findByGenreIgnoreCaseOrderByCreatedAtDesc(genre);
        }

        if ("collab".equalsIgnoreCase(filter)) {
            return poemRepository.findByIsCollabOpenTrueOrderByCreatedAtDesc();
        }

        if ("trending".equalsIgnoreCase(filter)) {
            return poemRepository.findAllByOrderByLikesCountDesc();
        }

        if ("following".equalsIgnoreCase(filter) && currentUserId != null && !currentUserId.isBlank()) {
            User user = userService.getById(currentUserId);
            if (user.getFollowing().isEmpty()) {
                return Collections.emptyList();
            }
            return poemRepository.findByAuthorIdInOrderByCreatedAtDesc(new ArrayList<>(user.getFollowing()));
        }

        return poemRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Poem> getPoemsByAuthor(String authorId) {
        return poemRepository.findByAuthorIdOrderByCreatedAtDesc(authorId);
    }

    public Poem updatePoem(String poemId, String userId, PoemRequestDTO request) {
        Poem poem = getById(poemId);
        if (!poem.getAuthorId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to edit this poem");
        }

        if (request.getTitle() != null) poem.setTitle(request.getTitle().trim());
        if (request.getContent() != null) poem.setContent(request.getContent().trim());
        if (request.getGenre() != null) poem.setGenre(request.getGenre().trim());
        if (request.getMood() != null) poem.setMood(request.getMood().trim());
        if (request.getTags() != null) poem.setTags(request.getTags());
        poem.setCollabOpen(request.isCollabOpen());
        if (request.getCollabMode() != null) poem.setCollabMode(request.getCollabMode());
        poem.setUpdatedAt(Instant.now());

        return poemRepository.save(poem);
    }

    public void deletePoem(String poemId, String userId) {
        Poem poem = getById(poemId);
        if (!poem.getAuthorId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to delete this poem");
        }
        commentRepository.deleteByPoemId(poemId);
        poemRepository.deleteById(poemId);
    }

    public Poem toggleLike(String poemId, String userId) {
        Poem poem = getById(poemId);
        if (poem.getLikedBy().contains(userId)) {
            poem.getLikedBy().remove(userId);
        } else {
            poem.getLikedBy().add(userId);
        }
        poem.setLikesCount(poem.getLikedBy().size());
        return poemRepository.save(poem);
    }
}
