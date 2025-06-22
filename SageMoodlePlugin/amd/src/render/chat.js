// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Manages the visual representation and user interaction of the chat window, including creating, displaying,
 * and handling messages.  It also handles the chat button and context highlighting.
 *
 * @module     block_sage/render/chat
 * @copyright  2024 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define(['jquery', 'block_sage/api/chat_api', 'block_sage/api/selection_api'],
    function ($, chat_api, selection_api) {

    const sageChatButtonSelector = '.sage-chat-button';
    const sageChatWindowSelector = '.sage-chat-window';
    const sageMessageInputSelector = '.sage-message-input';
    const sageChatLabelSelector = '.sage-chat-label';
    let sageIcon = null;

    $('<style type="text/css">')
        .html(`
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        .sage-chat-icon {
            width: 50px;
            height: 50px;
        }

        .sage-chat-button {
            position: fixed;
            bottom: 80px;
            right: 0px;
            display: flex;
            align-items: center;
            background-color: white;
            border-radius: 50%;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 10px;
            cursor: pointer;
            transition: all 0.3s;
            width: 70px;
            height: 70px;
            user-select: none;
        }

        .sage-chat-label {
            margin-left: 10px;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .sage-chat-button.expanded {
            border-radius: 25px;
            width: 200px;
        }

        .sage-chat-button.expanded .sage-chat-label {
            opacity: 1;
        }

        .sage-chat-window {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 400px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }

        .sage-chat-header {
            background-color: #f1f1f1;
            padding: 10px;
            display: flex;
            justify-content: flex-end;
        }

        .sage-chat-close {
            border: none;
            background: none;
            font-size: 18px;
            cursor: pointer;
        }

        .sage-chat-messages {
            max-height: 600px;
            overflow-y: auto;
            padding: 10px;
        }

        .sage-message {
            display: flex;
            align-items: flex-start;
            margin-bottom: 10px;
        }

        .sage-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }

        .sage-message-content {
            background-color: #f1f1f1;
            border-radius: 10px;
            padding: 10px;
            max-width: 70%;
        }

        .sage-chat-input {
            display: flex;
            align-items: center;
            padding: 10px;
            background-color: #fff;
            border-top: 1px solid #e1e1e1;
        }

        .sage-message-input {
            flex: 1;
            border: 1px solid #e1e1e1;
            border-radius: 20px;
            padding: 10px;
            margin-right: 10px;
        }

        .sage-send-button {
            background: none;
            border: none;
            cursor: pointer;
        }

        .sage-send-icon {
          width: 20px;
          height: 20px;
        }
        
        .sage-chat-context {
            display: flex;
            align-items: center;
            padding: 10px;
            background-color: #f1f1f1;
            border-bottom: 1px solid #e1e1e1;
            font-size: 14px;
        }
        
        .sage-context-text {
            flex: 1;
            margin-left: 5px;
            color: #333;
        }
        
        .sage-clear-context {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            color: #666;
            margin-left: 10px;
        }
        
        .sage-clear-context:hover {
            color: #000;
        }
        `)
        .appendTo('head');

     /**
     * Creates the chat button that appears on the webpage.  This button, when clicked, toggles the chat window's visibility.
     * @function
     */
     function createButton() {
        $('body').append(`
            <div class="sage-chat-button">
                <img src=${sageIcon} alt="Chat Icon" class="sage-chat-icon">
                <span class="sage-chat-label">Посоветоваться с Мудрецом</span>
            </div>
        `);

        $(sageChatButtonSelector).hide().fadeIn();

        $(sageChatButtonSelector).on('mouseenter', function () {
            if (!window.getSelection().toString()) {
                $(this).addClass('expanded');
            }
        }).on('mouseleave', function () {
            if (!window.getSelection().toString()) {
                $(this).removeClass('expanded');
            }
        });

        $(sageChatButtonSelector).on('click', function () {
            const selectedText = window.getSelection().toString();
            if (selectedText) {
                selection_api.setCurrentSelection(selectedText);
                chat_api.setChatState(true);
            } else {
                chat_api.setChatState(true);
            }
        });

        document.addEventListener('selectionchange', function () {
            const selectedText = window.getSelection().toString();
            const $button = $(sageChatButtonSelector);
            const $label = $(sageChatLabelSelector);

            if (selectedText) {
                $label.text('Пояснить');
                $button.addClass('expanded');
            } else {
                $label.text('Посоветоваться с Мудрецом');
                $button.removeClass('expanded');
            }
        });
    }

    /**
     * Creates the chat window which includes the header, message area, input field, and send button.
     * @function
     */
    function createChat() {
        $('body').append(`
            <div class="sage-chat-window" style="display:none;">
                <div class="sage-chat-header">
                    <button class="sage-chat-close">></button>
                </div>
                <div class="sage-chat-messages"></div>
                <div class="sage-chat-context" style="display: none;">
                    <span>Контекст: </span>
                    <span class="sage-context-text"></span>
                    <button class="sage-clear-context">×</button>
                </div>
                <div class="sage-chat-input">
                    <input type="text" placeholder="Введите Ваш вопрос" class="sage-message-input">
                    <button class="sage-send-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-[1.5]"
                        id="#sendbutton"><path d="M10 14l11 -11"></path><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 
                        -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path></svg>
                    </button>
                </div>
            </div>
        `);

        $('.sage-chat-close').on('click', function () {
            chat_api.setChatState(false);
        });

        $('.sage-send-button').on('click', function () {
            sendMessage();
        });

        $('.sage-message-input').on('keypress', function (e) {
            if (e.which === 13) {
                sendMessage();
            }
        });

        $('.sage-clear-context').on('click', function () {
            selection_api.resetSelection();
        });
    }

    /**
     * Updates the UI to reflect the current context (selected text), showing or hiding the context display as needed.
     * @returns {void}
     */
    function updateContextUI() {
        const contextElement = $('.sage-chat-context');
        const contextTextElement = $('.sage-context-text');
        if (selection_api.getCurrentSelection()) {
            contextTextElement.text(selection_api.getCurrentSelection());
            contextElement.show();
        } else {
            contextElement.hide();
        }
    }


    /**
     * Scrolls the chat message container to the bottom, ensuring the latest message is visible.
     * @returns {void}
     */
    function scrollToBottom() {
        const $messagesContainer = $('.sage-chat-messages');
        $messagesContainer.scrollTop($messagesContainer[0].scrollHeight);
    }

    /**
     * Toggles the visibility of the chat window based on the chat state.
     * @returns {void}
     */
    function toggleChat() {
        if (chat_api.isChatOpen()) {
            $(sageChatWindowSelector).slideDown();
            $(sageChatButtonSelector).fadeOut();
            renderChat();
        } else {
            $(sageChatWindowSelector).slideUp();
            $(sageChatButtonSelector).fadeIn();
        }
    }

    /**
     * Renders the chat messages in the chat window, clearing existing messages and adding each message from the chat history.
     * @returns {void}
     */
    function renderChat() {
        $('.sage-chat-messages').empty();
        const messages = chat_api.getChatMessages();
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            addMessageToChat(message.role, message.message);
        }
        scrollToBottom();
    }

    /**
     * Adds a single message to the chat display.
     * @function
     * @param {"SAGE"|"USER"} type - The message sender ("SAGE" for the AI, "USER" for the user).
     * @param {string} messageText - The text content of the message.
     * @returns {void}
     */
    function addMessageToChat(type, messageText) {
        $('.sage-chat-messages').append(`
            <div class="sage-message">
                <img src=${type === "SAGE" ? sageIcon : "https://avatars.mds.yandex.net/get-yapic/0/0-0/islands-retina-middle"}
                  alt="Avatar" class="sage-avatar">
                <div class="sage-message-content">
                    <strong>${type === "SAGE" ? "Мудрец" : "Вы"}</strong>
                    ${messageText}
                </div>
            </div>
        `);
    }

    /**
     * Sends the user's message from the input field, clears the input, and processes the message through the chat API.
     * @returns {void}
     */
    function sendMessage() {
        const messageText = $(sageMessageInputSelector).val();
        if (messageText.trim()) {
            chat_api.processNewChatMessage(messageText);
        }
        $(sageMessageInputSelector)[0].value="";
    }

    return {
        init: function () {
            sageIcon = M.cfg.wwwroot + "/blocks/sage/pix/icon.png";
            createButton();
            createChat();
            chat_api.registerChatStateListener(toggleChat);
            chat_api.registerChatMessageListener(renderChat);
            selection_api.registerSelectionChangeListener(updateContextUI);
        }
    };
});