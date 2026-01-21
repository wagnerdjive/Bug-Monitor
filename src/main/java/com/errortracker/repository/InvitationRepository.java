package com.errortracker.repository;

import com.errortracker.entity.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Integer> {
    Optional<Invitation> findByToken(String token);
    Optional<Invitation> findByEmailAndStatus(String email, String status);
    List<Invitation> findByInvitedBy(Integer invitedBy);
    List<Invitation> findByStatus(String status);
    boolean existsByEmailAndStatus(String email, String status);
}
