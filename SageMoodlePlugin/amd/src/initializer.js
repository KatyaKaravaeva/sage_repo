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
 * Initializes the Sage block, setting up necessary components and event listeners.
 * Checks for quiz attempt URL, checks Sage availability, and initializes chat,
 * error explanation, and focus tracking functionalities.
 *
 * @module     block_sage/initializer
 * @copyright  2025 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define(['block_sage/api/chat_api', 'block_sage/render/chat', 'block_sage/render/explain_error', 'core/ajax',
        'block_sage/controller/focus_controller',
    ],
    function (chat_api, chat, explain_error, Ajax, focus_controller,

    ) {
        return {
            init: function () {
                if (window.location.href.match(/attempt=(\d+)/) === null) {
                    return;
                }
                const request = Ajax.call([
                    {
                        methodname: 'block_sage_check_availability',
                        args: {},
                    },
                ]);

                request[0].done(function (response) {
                    if (response.available) {
                        chat.init();
                        chat_api.syncMessagesFromServer();
                        explain_error.init();
                        focus_controller.init();
                    }
                });
                request[0].fail(function (e) {
                    window.console.error("The sage API is temporary unavailable: ", e);
                });
            },
        };
    });