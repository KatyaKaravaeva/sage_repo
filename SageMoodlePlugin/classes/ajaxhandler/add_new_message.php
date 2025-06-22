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
 * Defines the Moodle external API for adding a new message to the chat.
 * This allows external systems to interact with the Sage block's chat functionality.
 *
 * @package    block_sage\ajaxhandler
 * @copyright  2025 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
namespace block_sage\ajaxhandler;

use curl;
use external_api;
use external_function_parameters;
use external_single_structure;
use external_value;
use moodle_exception;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/filelib.php');
require_once($CFG->libdir . '/enrollib.php');
require_once($CFG->libdir . '/accesslib.php');

class add_new_message extends external_api {

    /**
     * Defines the parameters expected by the add_new_message web service function.
     *
     * @return external_function_parameters The parameters definition.
     */
    public static function add_new_message_parameters() {
        return new external_function_parameters([
            'attemptId' => new external_value(PARAM_INT, 'The id of the current attempt'),
            'message' => new external_value(PARAM_TEXT, 'Message to send'),
            'context' => new external_value(PARAM_TEXT, 'Conext attached to the message'),
        ]);
    }

    /**
     * Adds a new message to the chat.  Sends the message to the mediator and returns the response.
     *
     * @param int $attemptId The ID of the quiz attempt.
     * @param string $message The message text.
     * @param string $context The context associated with the message (e.g., selected text).
     * @return array The message received from the mediator.
     * @throws moodle_exception If user is not enrolled, attempt is not valid, curl fails or the mediator returns an invalid response
     * @global object $USER
     * @global object $DB
     * @global object $COURSE
     */
    public static function add_new_message($attemptId, $message, $context) {
        global $USER, $DB, $COURSE;

        require_login();

        self::validate_parameters(self::add_new_message_parameters(), [
            'attemptId' => $attemptId,
            'message' => $message,
            'context' => $context
        ]);

        $studentid = $USER->id;
        $courseid = $COURSE->id;
        
        if (!is_enrolled(\context_course::instance($courseid), $USER->id)) {
            throw new moodle_exception('nopermission', 'block_sage');
        }

        $attempt = $DB->get_record('quiz_attempts', ['id' => $attemptId], '*', MUST_EXIST);

        if(!$attempt){
            throw new moodle_exception('invalidarguments', 'block_sage');
        }

        $quiz = $DB->get_record('quiz', ['id' => $attempt->quiz], '*', MUST_EXIST);

        $data = [
            'userId' => $studentid,
            'quizId' => $quiz->id,
            'message' => $message,
            'context' => $context
        ];

        $curl = new curl();
        $mediator_ip = get_config('block_sage', 'mediator_address');
        $response = $curl->post($mediator_ip . 'api/chat/add_message', json_encode($data), [
            'CURLOPT_HTTPHEADER' => [
                'Content-Type: application/json',
            ],
        ]);
        if ($curl->get_errno()) {
            throw new moodle_exception('curlerror', 'block_sage', '', $curl->error);
        }

        $message = json_decode($response, true);

        if (!isset($message['message'])) {
            throw new moodle_exception('invalidresponse', 'block_sage');
        }

        return $message;
    }

    /**
     * Defines the structure of the data returned by the add_new_message web service function.
     *
     * @return external_single_structure The return value definition.
     */
    public static function add_new_message_returns() {
        return new external_single_structure([
            'message' => new external_single_structure([
                            'role' => new external_value(PARAM_TEXT, 'Sender\'s role'),
                            'message' => new external_value(PARAM_RAW, 'Message text'),
                        ])
        ]);
    }
}