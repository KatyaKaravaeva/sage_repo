package com.hse.sage.controller;

import com.hse.sage.adapters.BackendAdapter;
import com.hse.sage.config.BackendAdapterFactory;
import com.hse.sage.dto.response.AvailabilityResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/status")
@Tag(name = "Status Controller", description = "Контроллер для проверки статуса сервиса")
public class StatusController {

    @Autowired
    private BackendAdapterFactory backendAdapterFactory;

    @GetMapping("/check_availability")
    @Operation(
            summary = "Проверить доступность сервиса",
            description = "Эндпоинт для проверки доступности сервиса. Всегда возвращает true.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Сервис доступен",
                            content = @Content(
                                    mediaType = "application/json",
                                    examples = @ExampleObject(value = "{\"available\": true}")
                            )
                    )
            }
    )
    public AvailabilityResponse checkAvailability(@RequestParam int courseId) {
        try{
            BackendAdapter adapter = backendAdapterFactory.getAdapter(courseId);
            boolean isAvailable = adapter.checkAvailability();
            return new AvailabilityResponse(isAvailable);
        } catch (IllegalArgumentException e) {
            return new AvailabilityResponse(false);
        }
    }
}