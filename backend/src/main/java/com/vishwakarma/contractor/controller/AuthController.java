package com.vishwakarma.contractor.controller;

import com.vishwakarma.contractor.dto.AuthResponse;
import com.vishwakarma.contractor.dto.LoginRequest;
import com.vishwakarma.contractor.dto.TokenRefreshRequest;
import com.vishwakarma.contractor.dto.TokenRefreshResponse;
import com.vishwakarma.contractor.model.AppUser;
import com.vishwakarma.contractor.model.RefreshToken;
import com.vishwakarma.contractor.repository.UserRepository;
import com.vishwakarma.contractor.security.JwtTokenProvider;
import com.vishwakarma.contractor.security.RefreshTokenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          RefreshTokenService refreshTokenService,
                          UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.refreshTokenService = refreshTokenService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername().trim(),
                            loginRequest.getPassword().trim()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            AppUser user = userRepository.findByUsername(loginRequest.getUsername().trim())
                    .orElseThrow(() -> new RuntimeException("User not found after authentication"));

            // 15-minute Access Token
            String jwt = tokenProvider.generateToken(authentication, user.getFullName());

            // 7-day Refresh Token stored in Supabase DB
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

            return ResponseEntity.ok(new AuthResponse(
                    jwt,
                    refreshToken.getToken(),
                    user.getUsername(),
                    user.getFullName(),
                    user.getRole()
            ));
        } catch (BadCredentialsException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid contractor credentials. Please check your email/username and password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication failed: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    // Generate new 15-minute Access Token
                    String newAccessToken = tokenProvider.generateTokenFromUsername(
                            user.getUsername(),
                            user.getRole(),
                            user.getFullName()
                    );
                    return ResponseEntity.ok(new TokenRefreshResponse(newAccessToken, requestRefreshToken));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new TokenRefreshResponse(null, null)));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestBody(required = false) TokenRefreshRequest request,
                                        Authentication authentication) {
        if (request != null && request.getRefreshToken() != null) {
            refreshTokenService.deleteByToken(request.getRefreshToken());
        }

        if (authentication != null && authentication.isAuthenticated()) {
            userRepository.findByUsername(authentication.getName())
                    .ifPresent(user -> refreshTokenService.deleteByUserId(user.getId()));
        }

        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "User logged out successfully. All refresh tokens revoked from DB."));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        String username = authentication.getName();
        AppUser user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("username", user.getUsername());
        userData.put("fullName", user.getFullName());
        userData.put("role", user.getRole());
        userData.put("createdAt", user.getCreatedAt());

        return ResponseEntity.ok(userData);
    }
}
