package com.hse.sage.dto.request;

import lombok.Data;

@Data
public class AddChatMessageRequest {
    private int userId;
    private int quizId;
    private String message;
    private String context;
}
