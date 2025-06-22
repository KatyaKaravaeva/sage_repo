package com.hse.sage.repository;

import com.hse.sage.document.RequestAction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestActionRepository extends MongoRepository<RequestAction, String> {
}