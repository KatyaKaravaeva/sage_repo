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
 * Manages the currently selected text within the page, allowing other modules to access and respond to selection changes.
 *
 * @module     block_sage/api/selection_api
 * @copyright  2024 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define(function() {
    let curSelection = "";

    let selectionChangeListeners = [];

    /**
     * Gets the currently selected text.
     *
     * @returns {string} The currently selected text.
     */
    function getCurrentSelection(){
        return curSelection;
    }

    /**
     * Sets the currently selected text and notifies all registered listeners.
     *
     * @param {string} selection The new text selection.
     * @returns {void}
     */
    function setCurrentSelection(selection){
        curSelection = selection;
        selectionChangeListeners.forEach((listener) => listener());
    }

    /**
     * Resets the current selection to an empty string and notifies listeners.
     * @returns {void}
     */
    function resetSelection(){
        setCurrentSelection("");
    }

    /**
     * Registers a listener function to be called when the selected text changes.
     *
     * @param {function} listener The listener function to register.
     * @returns {void}
     */
    function registerSelectionChangeListener(listener) {
        selectionChangeListeners.push(listener);
    }

    return {
        getCurrentSelection: getCurrentSelection,

        setCurrentSelection: setCurrentSelection,

        resetSelection: resetSelection,

        registerSelectionChangeListener: registerSelectionChangeListener
    };
});