package com.hse.sage.document;

import lombok.Data;

@Data
public class QuestionAttempt {
    private Question question;
    private Attempt attempt;
}