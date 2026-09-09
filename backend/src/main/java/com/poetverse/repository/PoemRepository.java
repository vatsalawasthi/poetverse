package com.poetverse.repository;

import com.poetverse.model.Poem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PoemRepository extends MongoRepository<Poem, String> {
    List<Poem> findByAuthorIdOrderByCreatedAtDesc(String authorId);
    List<Poem> findByGenreIgnoreCaseOrderByCreatedAtDesc(String genre);
    List<Poem> findByIsCollabOpenTrueOrderByCreatedAtDesc();
    List<Poem> findByAuthorIdInOrderByCreatedAtDesc(List<String> authorIds);
    List<Poem> findAllByOrderByCreatedAtDesc();
    List<Poem> findAllByOrderByLikesCountDesc();

    @Query("{ '$or': [ { 'title': { $regex: ?0, $options: 'i' } }, { 'content': { $regex: ?0, $options: 'i' } }, { 'tags': { $regex: ?0, $options: 'i' } }, { 'authorDisplayName': { $regex: ?0, $options: 'i' } } ] }")
    List<Poem> searchPoems(String query);

    List<Poem> findByAuthorId(String authorId);
    void deleteByAuthorId(String authorId);
    int countByAuthorId(String authorId);
}
