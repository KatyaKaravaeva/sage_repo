package com.hse.sage.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Ответ на запрос проверки доступности сервиса")
public class AvailabilityResponse {

    @Schema(description = "Статус доступности сервиса", example = "true")
    private boolean available;
}