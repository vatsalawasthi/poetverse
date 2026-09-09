package com.poetverse.repository;

import com.poetverse.model.Collaboration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollaborationRepository extends MongoRepository<Collaboration, String> {
    List<Collaboration> findByStatusOrderByCreatedAtDesc(String status);
    List<Collaboration> findByLeadAuthorIdOrderByCreatedAtDesc(String leadAuthorId);
    void deleteByLeadAuthorId(String leadAuthorId);
    List<Collaboration> findAllByOrderByCreatedAtDesc();
}
