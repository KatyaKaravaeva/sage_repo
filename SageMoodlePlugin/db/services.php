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
 * Defines the web service functions for the Sage block and registers them with Moodle's web service framework.
 *
 * @package    block_sage
 * @since      Moodle 3.6
 * @copyright  2025 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$services = [
    'block_sage_service' => [
        'functions' => ['block_sage_get_chat_messages', 'block_sage_add_chat_message', 'block_sage_process_action_request', 'block_sage_check_availability'],
        'restrictedusers' => 0,
        'enabled' => 1,
    ],
];

$functions = array(
    'block_sage_get_chat_messages' => array(
        'classname' => 'block_sage\ajaxhandler\get_chat_messages',
        'methodname' => 'get_chat_messages',
        'classpath' => '',
        'description' => 'Gets the list of messages.',
        'type' => 'read',
        'ajax' => true
    ),
    'block_sage_add_chat_message' => array(
        'classname' => 'block_sage\ajaxhandler\add_new_message',
        'methodname' => 'add_new_message',
        'classpath' => '',
        'description' => 'Adds a new message to the chat',
        'type' => 'read',
        'ajax' => true
    ),
    'block_sage_process_action_request' => array(
        'classname' => 'block_sage\ajaxhandler\process_action_request',
        'methodname' => 'process_action_request',
        'classpath' => '',
        'description' => 'Processes the action request',
        'type' => 'read',
        'ajax' => true
    ),
    'block_sage_check_availability' => array(
        'classname' => 'block_sage\ajaxhandler\check_availability_message',
        'methodname' => 'check_availability_message',
        'classpath' => '',
        'description' => 'Checks if the service is available',
        'type' => 'read',
        'ajax' => true
    ),
);