package com.hse.sage.controller;

import com.hse.sage.document.RequestAction;
import com.hse.sage.dto.response.SingleMessageResponse;
import com.hse.sage.service.ActionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/actions")
@Tag(name = "Action Controller", description = "Контроллер для выполнения аналитических действий")
public class ActionController {

    @Autowired
    private ActionService actionService;

    @PostMapping("/perform_action")
    public SingleMessageResponse handleActionRequest(@RequestBody RequestAction requestAction) {
        return actionService.handleActionRequest(requestAction);
    }
}