package com.hse.sage.entity;

import com.hse.sage.constants.ChatMessageRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "messageId")
@Entity
@Table(name = "chat_message")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Integer messageId;

    @Column(name = "chat_owner_id", nullable = false)
    private Integer chatOwnerId;

    @Column(name = "quiz_id", nullable = false)
    private Integer quizId;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "role", nullable = false)
    private ChatMessageRole role;

    @Column(name = "context", columnDefinition = "TEXT")
    private String context;

    @Column(name = "timestamp", nullable = false)
    private Long timestamp;
}