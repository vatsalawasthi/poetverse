package com.poetverse.service;

import com.poetverse.model.Comment;
import com.poetverse.model.Poem;
import com.poetverse.model.User;
import com.poetverse.repository.CommentRepository;
import com.poetverse.repository.PoemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PoemRepository poemRepository;
    private final UserService userService;

    public Comment addComment(String poemId, String userId, String content, Integer lineIndex) {
        User user = userService.getById(userId);
        Poem poem = poemRepository.findById(poemId)
                .orElseThrow(() -> new IllegalArgumentException("Poem not found: " + poemId));

        Comment comment = Comment.builder()
                .poemId(poem.getId())
                .userId(user.getId())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .userAvatar(user.getAvatar())
                .content(content.trim())
                .lineIndex(lineIndex)
                .createdAt(Instant.now())
                .build();

        Comment saved = commentRepository.save(comment);

        // Update comment count
        poem.setCommentsCount(commentRepository.countByPoemId(poemId));
        poemRepository.save(poem);

        return saved;
    }

    public List<Comment> getCommentsForPoem(String poemId) {
        return commentRepository.findByPoemIdOrderByCreatedAtAsc(poemId);
    }
}
