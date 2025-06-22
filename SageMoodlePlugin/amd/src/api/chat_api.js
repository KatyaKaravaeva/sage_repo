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
 * Provides an API for interacting with the chat functionality, including sending and receiving messages,
 * managing chat state, and registering listeners for chat events.
 *
 * @module     block_sage/api/chat_api
 * @copyright  2024 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define(['core/ajax', 'block_sage/api/selection_api', 'block_sage/questions/request_args'],
    function(Ajax, selection_api, request_args) {

    let chatOpen = false;
    let curChatMessages = [];
    let wasSynced = false;

    let chatStateListeners = [];
    let chatMessageListeners = [];

    /**
     * Synchronizes chat messages with the server, fetching the latest messages and updating the local chat history.
     *
     * @returns {void}
     */
    function syncMessagesFromServer() {
        var args = request_args.getAttemptFromURL();
        const request = Ajax.call([{
            methodname: 'block_sage_get_chat_messages',
            args: args,
        }]);

        request[0].done(function(response) {
            curChatMessages = [];
            response.messages.forEach((m)=>addMessageToChat(m));
        }).fail(function(error) {
            window.console.error('Error:', error);
        });
    }

    /**
     * Retrieves the current chat messages. If the messages haven't been synced yet,
     * it synchronizes them from the server first.
     *
     * @returns {[{role: string, message: string}]} An array of chat message objects.
     */
    function getChatMessages() {
        if(!wasSynced) {
            wasSynced = true;
            syncMessagesFromServer();
        }
        return curChatMessages;
    }

    /**
     * Sends a new chat message to the server, triggers processing, and updates the chat with responses.
     *
     * @param {string} message The message text to be sent.
     * @returns {void}
     */
    function processNewChatMessage(message) {
        var args_msg = request_args.getAttemptFromURL();
        var args_process = request_args.getRequestWithData();
        if(args_msg===null || args_process===null){
            window.console.error('Error: This page does not allow chat opening');
            return;
        }

        const request = Ajax.call([
            {
                methodname: 'block_sage_add_chat_message',
                args: {
                    ...args_msg,
                    context: selection_api.getCurrentSelection(),
                    message: message,
                },
            },
            {
                methodname: 'block_sage_process_action_request',
                args: {
                    ...args_process,
                    requestType: 'CHAT_ANALYZE'
                },
            },
        ]);

        request[0].done(function(response) {
            addMessageToChat(response.message);
        }).fail(function(error) {
            window.console.error('Error while sending the message: '+error.message);
        });

        request[1].done(function(response) {
            addMessageToChat(response.message);
        }).fail(function(error) {
            window.console.error('Error while processing chat: '+error.message);
        });
    }

    /**
     * Adds a message to the local chat history and notifies all message listeners.
     *
     * @param {{role: string, message: string}} message The chat message object to add.
     * @returns {void}
     */
    function addMessageToChat(message) {
        curChatMessages.push(message);
        chatMessageListeners.forEach((listener) => listener());
    }

    /**
     * Checks if the chat window is currently open.
     *
     * @returns {boolean} True if the chat is open, false otherwise.
     */
    function isChatOpen(){
        return chatOpen;
    }

    /**
     * Sets the chat window's open/closed state and notifies all state listeners.
     *
     * @param {boolean} open True to open the chat, false to close it.
     * @returns {void}
     */
    function setChatState(open){
        chatOpen = open;
        chatStateListeners.forEach((listener) => listener());
    }

    /**
     * Registers a listener function to be called when the chat state changes (opened/closed).
     *
     * @param {function} listener The listener function to register.
     * @returns {void}
     */
    function registerChatStateListener(listener) {
        chatStateListeners.push(listener);
    }

    /**
     * Registers a listener function to be called when a new message is added to the chat.
     *
     * @param {function} listener The listener function to register.
     * @returns {void}
     */
    function registerChatMessageListener(listener) {
        chatMessageListeners.push(listener);
    }

    return {
        syncMessagesFromServer: syncMessagesFromServer,

        isChatOpen: isChatOpen,

        setChatState: setChatState,

        getChatMessages: getChatMessages,

        addMessageToChat: addMessageToChat,

        processNewChatMessage: processNewChatMessage,

        registerChatMessageListener: registerChatMessageListener,

        registerChatStateListener: registerChatStateListener,
    };
});