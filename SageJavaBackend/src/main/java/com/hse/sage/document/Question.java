package com.hse.sage.document;

import lombok.Data;

@Data
public class Question {
    private int questionId;
    private String questionName;
    private String type;
    private long timeModified;
    private String questionText;
    private QuestionExtraData extraData;
}