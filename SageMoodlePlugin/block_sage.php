<?php
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
 * Defines the Sage block class, which is responsible for the block's basic behavior and rendering.
 *
 * @package    block_sage
 * @copyright  2024 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class block_sage extends block_base {

    /**
     * Initializes the block instance.
     * Sets the block title and disables JavaScript caching.
     * @global object $CFG
     * @return void
     */
    public function init() {
        global $CFG;
        $CFG->cachejs = false;
        $this->title = get_string('blocktitle', 'block_sage');
    }

    /**
     * Returns the block's content.
     * If content is already set, returns it; otherwise, sets the default text and initializes JavaScript.
     * @global object $PAGE
     * @return stdClass The block content object.
     */
    public function get_content() {
        if ($this->content !== null) {
            return $this->content;
        }
        $this->content = (object)[
            'text' => get_string('sagetext', 'block_sage'),
        ];
        global $PAGE;
        $PAGE->requires->js_call_amd('block_sage/initializer', 'init');

        return $this->content;
    }

    /**
     * Indicates whether the block has a configuration page.
     *
     * @return bool True if the block has a configuration page, false otherwise.
     */
    public function has_config() {
        return true;
    }

    /**
     * Specifies the Moodle formats to which this block can be added.
     *
     * @return array An associative array where keys are Moodle formats and values are booleans (true if applicable).
     */
    public function applicable_formats() {
        return [
            'mod-quiz-view' => true, 
            'mod-quiz-attempt' => true, 
            'mod-quiz-review' => true,
        ];
    }
}