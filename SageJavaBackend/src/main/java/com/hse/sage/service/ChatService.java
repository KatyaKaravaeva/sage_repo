package com.hse.sage.service;

import com.hse.sage.constants.ChatMessageRole;
import com.hse.sage.dto.request.AddChatMessageRequest;
import com.hse.sage.dto.request.ChatRequest;
import com.hse.sage.dto.response.ChatMessageResponse;
import com.hse.sage.dto.response.MessagesResponse;
import com.hse.sage.dto.response.SingleMessageResponse;
import com.hse.sage.entity.ChatMessage;
import com.hse.sage.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public MessagesResponse getMessages(ChatRequest request) {
        List<ChatMessage> messages = chatMessageRepository.findByChatOwnerIdAndQuizId(request.getUserId(), request.getQuizId());

        List<ChatMessageResponse> messageResponses = messages.stream()
                .map(this::convertToChatMessageResponse)
                .collect(Collectors.toList());

        MessagesResponse response = new MessagesResponse();
        response.setMessages(messageResponses);
        return response;
    }

    public SingleMessageResponse addMessage(AddChatMessageRequest request) {
        ChatMessage newMessage = new ChatMessage();
        newMessage.setChatOwnerId(request.getUserId());
        newMessage.setQuizId(request.getQuizId());
        newMessage.setMessage("<p>"+request.getMessage()+"</p>");
        newMessage.setRole(ChatMessageRole.STUDENT);
        newMessage.setContext(request.getContext());
        newMessage.setTimestamp(Instant.now().getEpochSecond());

        ChatMessage savedMessage = chatMessageRepository.save(newMessage);

        ChatMessageResponse messageResponse = convertToChatMessageResponse(savedMessage);

        SingleMessageResponse response = new SingleMessageResponse();
        response.setMessage(messageResponse);
        return response;
    }

    private ChatMessageResponse convertToChatMessageResponse(ChatMessage chatMessage) {
        ChatMessageResponse response = new ChatMessageResponse();
        response.setRole(chatMessage.getRole());
        response.setMessage(chatMessage.getMessage());
        return response;
    }
}
