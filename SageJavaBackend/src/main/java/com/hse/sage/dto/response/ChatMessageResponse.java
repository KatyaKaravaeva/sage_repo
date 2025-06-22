package com.hse.sage.dto.response;

import com.hse.sage.constants.ChatMessageRole;
import lombok.Data;

@Data
public class ChatMessageResponse {
    private ChatMessageRole role;
    private String message;
}
