package com.hse.sage.document;

import com.hse.sage.constants.RequestType;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "requestActions")
public class RequestAction {
    @Id
    private String id;

    private RequestType requestType;
    private int userId;
    private int courseId;
    private int attemptId;
    private int quizId;
    private String quizName;
    private List<QuestionAttempt> questions;
}