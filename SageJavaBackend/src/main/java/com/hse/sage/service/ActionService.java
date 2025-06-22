package com.hse.sage.service;

import com.hse.sage.adapters.BackendAdapter;
import com.hse.sage.config.BackendAdapterFactory;
import com.hse.sage.constants.ChatMessageRole;
import com.hse.sage.document.RequestAction;
import com.hse.sage.dto.response.ChatMessageResponse;
import com.hse.sage.dto.response.SingleMessageResponse;
import com.hse.sage.entity.ChatMessage;
import com.hse.sage.exception.CustomServiceException;
import com.hse.sage.repository.ChatMessageRepository;
import com.hse.sage.repository.RequestActionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ActionService {

    private static final Logger logger = LoggerFactory.getLogger(ActionService.class);

    @Autowired
    private RequestActionRepository requestActionRepository;
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private BackendAdapterFactory backendAdapterFactory;

    public SingleMessageResponse handleActionRequest(RequestAction requestAction) {
        try {
            requestActionRepository.save(requestAction);

            BackendAdapter adapter = backendAdapterFactory.getAdapter(requestAction.getCourseId());

            List<ChatMessage> chatMessages = chatMessageRepository.findByChatOwnerIdAndQuizId(
                    requestAction.getUserId(), requestAction.getQuizId());
            String sageResponse = adapter.processEvent(requestAction, chatMessages);

            SingleMessageResponse response = new SingleMessageResponse();
            ChatMessageResponse message = new ChatMessageResponse();
            message.setRole(ChatMessageRole.SAGE);
            message.setMessage(sageResponse);
            response.setMessage(message);


            ChatMessage newMessage = new ChatMessage();
            newMessage.setChatOwnerId(requestAction.getUserId());
            newMessage.setQuizId(requestAction.getQuizId());
            newMessage.setMessage(sageResponse);
            newMessage.setRole(ChatMessageRole.SAGE);
            newMessage.setContext("");
            newMessage.setTimestamp(Instant.now().getEpochSecond());

            chatMessageRepository.save(newMessage);

            return response;
        } catch (CustomServiceException e) {
            logger.error("Error processing action request", e);
            SingleMessageResponse errorResponse = new SingleMessageResponse();
            ChatMessageResponse errorMessage = new ChatMessageResponse();
            errorMessage.setRole(ChatMessageRole.SAGE);
            errorMessage.setMessage("Прошу прощения, сейчас я не могу дать подсказку. Давай поговорим позже.");
            errorResponse.setMessage(errorMessage);
            return errorResponse;
        }catch (IllegalArgumentException e) {
            logger.error("Configuration error: {}", e.getMessage());
            SingleMessageResponse errorResponse = new SingleMessageResponse();
            ChatMessageResponse errorMessage = new ChatMessageResponse();
            errorMessage.setRole(ChatMessageRole.SAGE);
            errorMessage.setMessage("Произошла ошибка конфигурации сервиса. Пожалуйста, обратитесь к администратору.");
            errorResponse.setMessage(errorMessage);
            return errorResponse;
        }
    }
}
