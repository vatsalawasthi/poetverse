package com.poetverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

public class AuthDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String displayName;
        private String bio;
        private String avatar;
        private List<String> interestGenres;
        private List<String> favoriteThemes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ForgotPasswordRequest {
        private String email;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResetPasswordRequest {
        private String email;
        private String code;
        private String newPassword;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private String id;
        private String username;
        private String displayName;
        private String email;
        private String bio;
        private String avatar;
        private List<String> interestGenres;
        private List<String> favoriteThemes;
        private Set<String> followers;
        private Set<String> following;
        private Set<String> bookmarkedPoemIds;
        private List<String> badges;
    }
}
