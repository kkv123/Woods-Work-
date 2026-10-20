package com.vishwakarma.contractor.repository;

import com.vishwakarma.contractor.model.AppUser;
import com.vishwakarma.contractor.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUser(AppUser user);

    @Modifying
    int deleteByUser(AppUser user);
}
