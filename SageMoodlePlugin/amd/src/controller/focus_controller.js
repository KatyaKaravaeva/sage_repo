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
 * Initializes focus tracking on question elements within a quiz, updating the focus API when a question receives focus.
 *
 * @module     block_sage/controller/focus_controller
 * @copyright  2025 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define(['jquery', 'block_sage/api/focus_api'], function($, focus_api) {
    /**
     * Initializes event listeners for 'focusin' events on question elements.
     * @returns {void}
     */
    function init() {
        const questions = $(".que");
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];

            question.addEventListener('focusin', () => {
                focus_api.setFocused(question.id);
            });
        }
    }

    return {
        init: init
    };
});