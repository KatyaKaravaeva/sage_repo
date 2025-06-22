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
 * Adds an "Explain Error" button to coderunner questions when test results indicate an error.
 * Clicking this button sends a request to explain the error through the chat.
 *
 * @module     block_sage/render/explain_error
 * @copyright  2025 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define(['core/ajax', 'block_sage/api/chat_api', 'block_sage/questions/request_args', 'jquery'],
    function(Ajax, chat_api, request_args, $) {

   /**
    * Adds an "Explain Error" button to the coderunner test results area if the results are marked as "bad".
    * @returns {void}
    */
   function addExplanationButton() {
       const $testResults = $('div.coderunner-test-results');

       if ($testResults.hasClass('bad')) {
           const $button = $('<input/>', {
               type: 'button',
               value: 'Пояснить ошибку',
               class: 'btn btn-secondary',
               'data-initial-value': 'Пояснить ошибку'
           });

           $button.on('click', function() {
               var args = request_args.getRequestWithData();
               const request = Ajax.call([{
                   methodname: 'block_sage_process_action_request',
                   args: {
                       ...args,
                       requestType: 'ERROR_EXPLAIN'
                   },
               }]);
               request[0].done(function(response) {
                   if(!chat_api.isChatOpen()){
                       chat_api.setChatState(true);
                   }
                   chat_api.addMessageToChat(response.message);
               }).fail(function(error) {
                   window.console.error('An error occured while sending a message: '+error.message);
               });
           });

           $testResults.append($button);
       }
   }

   return {
       init: addExplanationButton
   };
});