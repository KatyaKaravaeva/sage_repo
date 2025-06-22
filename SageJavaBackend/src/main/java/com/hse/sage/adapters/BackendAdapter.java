package com.hse.sage.adapters;

import com.hse.sage.document.RequestAction;
import com.hse.sage.entity.ChatMessage;
import java.util.List;

public interface BackendAdapter {

    String getAdapterName();

    boolean checkAvailability();

    String processEvent(RequestAction requestAction, List<ChatMessage> chatMessages);
}