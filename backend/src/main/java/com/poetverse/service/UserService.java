package com.poetverse.service;

import com.poetverse.dto.AuthDTO;
import com.poetverse.model.User;
import com.poetverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
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

        String recovery = request.getRecoveryCode() != null && !request.getRecoveryCode().isBlank()
                ? request.getRecoveryCode().trim()
                : "poet verse rhyme echo";

        User user = User.builder()
                .username(request.getUsername().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(request.getPassword())
                .recoveryCode(recovery)
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

    private String normalizeCode(String code) {
        if (code == null) return "";
        return code.trim().toLowerCase().replaceAll("\\s+", " ");
    }

    public Map<String, Object> verifyRecoveryCode(AuthDTO.VerifyRecoveryCodeRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Please enter your registered email or username.");
        }
        if (request.getRecoveryCode() == null || request.getRecoveryCode().isBlank()) {
            throw new IllegalArgumentException("Please enter your 4-word recovery code.");
        }

        String identifier = request.getEmail().trim();
        User user = userRepository.findByEmailIgnoreCase(identifier)
                .or(() -> userRepository.findByUsernameIgnoreCase(identifier))
                .orElseThrow(() -> new IllegalArgumentException("No account found with this email or username."));

        String userRecoveryCode = user.getRecoveryCode() != null && !user.getRecoveryCode().isBlank()
                ? user.getRecoveryCode()
                : "poet verse rhyme echo";

        String inputNorm = normalizeCode(request.getRecoveryCode());
        String storedNorm = normalizeCode(userRecoveryCode);

        if (!inputNorm.equals(storedNorm)) {
            throw new IllegalArgumentException("Recovery code does not match. Please enter the correct 4-word code you set during registration.");
        }

        // Generate temporary reset token valid for 15 minutes
        String resetToken = UUID.randomUUID().toString();
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordTokenExpiry(Instant.now().plus(15, ChronoUnit.MINUTES));
        userRepository.save(user);

        log.info("Recovery code verified for user: {}", user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("valid", true);
        response.put("resetToken", resetToken);
        response.put("email", user.getEmail());
        response.put("username", user.getUsername());
        response.put("message", "Recovery code verified successfully!");
        return response;
    }

    public Map<String, Object> forgotPassword(String email) {
        User user = userRepository.findByEmailIgnoreCase(email.trim())
                .or(() -> userRepository.findByUsernameIgnoreCase(email.trim()))
                .orElseThrow(() -> new IllegalArgumentException("No account registered with: " + email));

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Please enter your 4-word recovery code to reset password.");
        response.put("email", user.getEmail());
        return response;
    }

    public AuthDTO.AuthResponse resetPassword(AuthDTO.ResetPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email or username is required.");
        }
        if (request.getNewPassword() == null || request.getNewPassword().trim().length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters long.");
        }

        String identifier = request.getEmail().trim();
        User user = userRepository.findByEmailIgnoreCase(identifier)
                .or(() -> userRepository.findByUsernameIgnoreCase(identifier))
                .orElseThrow(() -> new IllegalArgumentException("No account found with: " + identifier));

        boolean tokenValid = user.getResetPasswordToken() != null 
                && request.getResetToken() != null
                && user.getResetPasswordToken().equals(request.getResetToken().trim())
                && user.getResetPasswordTokenExpiry() != null
                && user.getResetPasswordTokenExpiry().isAfter(Instant.now());

        String userRecoveryCode = user.getRecoveryCode() != null && !user.getRecoveryCode().isBlank()
                ? user.getRecoveryCode()
                : "poet verse rhyme echo";

        boolean codeMatches = request.getRecoveryCode() != null 
                && normalizeCode(request.getRecoveryCode()).equals(normalizeCode(userRecoveryCode));

        if (!tokenValid && !codeMatches) {
            throw new IllegalArgumentException("Recovery code does not match or session expired. Please verify your 4-word code again.");
        }

        user.setPassword(request.getNewPassword().trim());
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);

        log.info("Password successfully reset for user: {}", user.getEmail());
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
