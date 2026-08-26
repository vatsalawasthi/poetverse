package com.poetverse.service;

import com.poetverse.dto.AuthDTO;
import com.poetverse.model.User;
import com.poetverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = User.builder()
                .username(request.getUsername().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(request.getPassword()) // In production, hash with BCrypt
                .displayName(request.getDisplayName() != null && !request.getDisplayName().isBlank() 
                        ? request.getDisplayName().trim() 
                        : request.getUsername().trim())
                .bio(request.getBio() != null ? request.getBio().trim() : "Penning verses in the quiet corners of the world.")
                .avatar(request.getAvatar() != null && !request.getAvatar().isBlank() 
                        ? request.getAvatar() 
                        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
                .interestGenres(request.getInterestGenres() != null ? request.getInterestGenres() : List.of("Free Verse", "Sonnets"))
                .favoriteThemes(request.getFavoriteThemes() != null ? request.getFavoriteThemes() : List.of("Melancholy", "Philosophy"))
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .bookmarkedPoemIds(new HashSet<>())
                .badges(List.of("Novice Bard"))
                .build();

        User saved = userRepository.save(user);
        return mapToAuthResponse(saved);
    }

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        User user = userRepository.findByUsernameIgnoreCase(request.getUsername())
                .or(() -> userRepository.findByEmailIgnoreCase(request.getUsername()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return mapToAuthResponse(user);
    }

    public User getById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
    }

    public User getByUsername(String username) {
        return userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: @" + username));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateProfile(String userId, User updateData) {
        User user = getById(userId);
        if (updateData.getDisplayName() != null) user.setDisplayName(updateData.getDisplayName());
        if (updateData.getBio() != null) user.setBio(updateData.getBio());
        if (updateData.getAvatar() != null) user.setAvatar(updateData.getAvatar());
        if (updateData.getLocation() != null) user.setLocation(updateData.getLocation());
        if (updateData.getInterestGenres() != null) user.setInterestGenres(updateData.getInterestGenres());
        if (updateData.getFavoriteThemes() != null) user.setFavoriteThemes(updateData.getFavoriteThemes());
        return userRepository.save(user);
    }

    public boolean toggleFollow(String currentUserId, String targetUserId) {
        if (currentUserId.equals(targetUserId)) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }
        User currentUser = getById(currentUserId);
        User targetUser = getById(targetUserId);

        boolean nowFollowing;
        if (currentUser.getFollowing().contains(targetUserId)) {
            currentUser.getFollowing().remove(targetUserId);
            targetUser.getFollowers().remove(currentUserId);
            nowFollowing = false;
        } else {
            currentUser.getFollowing().add(targetUserId);
            targetUser.getFollowers().add(currentUserId);
            nowFollowing = true;
        }

        userRepository.save(currentUser);
        userRepository.save(targetUser);
        return nowFollowing;
    }

    public boolean toggleBookmark(String userId, String poemId) {
        User user = getById(userId);
        boolean bookmarked;
        if (user.getBookmarkedPoemIds().contains(poemId)) {
            user.getBookmarkedPoemIds().remove(poemId);
            bookmarked = false;
        } else {
            user.getBookmarkedPoemIds().add(poemId);
            bookmarked = true;
        }
        userRepository.save(user);
        return bookmarked;
    }

    public AuthDTO.AuthResponse mapToAuthResponse(User user) {
        return AuthDTO.AuthResponse.builder()
                .token("token-" + user.getId() + "-" + System.currentTimeMillis())
                .id(user.getId())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .email(user.getEmail())
                .bio(user.getBio())
                .avatar(user.getAvatar())
                .interestGenres(user.getInterestGenres())
                .favoriteThemes(user.getFavoriteThemes())
                .followers(user.getFollowers())
                .following(user.getFollowing())
                .bookmarkedPoemIds(user.getBookmarkedPoemIds())
                .badges(user.getBadges())
                .build();
    }
}
