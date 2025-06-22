package com.hse.sage.controller;

import com.hse.sage.dto.request.AddChatMessageRequest;
import com.hse.sage.dto.request.ChatRequest;
import com.hse.sage.dto.response.MessagesResponse;
import com.hse.sage.dto.response.SingleMessageResponse;
import com.hse.sage.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "Chat Controller", description = "Контроллер для работы с чатом")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/get_chat_messages")
    @Operation(
            summary = "Получить сообщения чата",
            description = "Эндпоинт для получения сообщений чата по userId и quizId.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Сообщения успешно получены",
                            content = @Content(
                                    mediaType = "application/json",
                                    examples = @ExampleObject(value = "{\"messages\": [{\"role\": \"STUDENT\", \"message\": \"Hello!\"}]}")
                            )
                    )
            }
    )
    public MessagesResponse getMessages(@RequestParam int userId, @RequestParam int quizId) {
        return chatService.getMessages(new ChatRequest(userId, quizId));
    }

    @PostMapping("/add_message")
    @Operation(
            summary = "Добавить сообщение в чат",
            description = "Эндпоинт для добавления сообщения в чат.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Сообщение успешно добавлено",
                            content = @Content(
                                    mediaType = "application/json",
                                    examples = @ExampleObject(value = "{\"message\": {\"role\": \"STUDENT\", \"message\": \"Hello!\"}}")
                            )
                    )
            }
    )
    public SingleMessageResponse addMessage(@RequestBody AddChatMessageRequest request) {
        return chatService.addMessage(request);
    }
}
