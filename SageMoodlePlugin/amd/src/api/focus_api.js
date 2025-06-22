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
 *  Manages the focus state of elements, specifically tracking the last time an element was focused.
 *
 * @module     block_sage/api/focus_api
 * @copyright  2025 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define(function() {
    let last_focused_time = {};

    /**
     * Retrieves the last time (in seconds since the epoch) a given element was focused.
     *
     * @param {string} id The ID of the element.
     * @returns {number} The timestamp (in seconds) when the element was last focused, or -1 if it hasn't been focused.
     */
    function getLastTimeFocused(id){
        if(last_focused_time[id]==undefined){
            return -1;
        }
        return last_focused_time[id];
    }

    /**
     * Sets the last focused time for a given element to the current time.
     *
     * @param {string} id The ID of the element being focused.
     * @returns {void}
     */
    function setFocused(id){
        last_focused_time[id] = Math.floor(Date.now()/1000);
    }

    return {
        getLastTimeFocused : getLastTimeFocused,
        setFocused : setFocused,
    };
});