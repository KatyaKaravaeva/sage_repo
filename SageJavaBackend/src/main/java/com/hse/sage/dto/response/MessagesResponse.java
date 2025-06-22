package com.hse.sage.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class MessagesResponse {
    private List<ChatMessageResponse> messages;
}
