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
 * Defines the Moodle external API for retrieving chat messages associated with a quiz attempt.
 *
 * @package    block_sage\ajaxhandler
 * @copyright  2025 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
namespace block_sage\ajaxhandler;

use curl;
use external_api;
use external_function_parameters;
use external_multiple_structure;
use external_single_structure;
use external_value;
use moodle_exception;


defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/filelib.php');
require_once($CFG->libdir . '/enrollib.php');
require_once($CFG->libdir . '/accesslib.php');

class get_chat_messages extends external_api {

    /**
     * Defines the parameters expected by the get_chat_messages web service function.
     *
     * @return external_function_parameters The parameters definition.
     */
    public static function get_chat_messages_parameters() {
        return new external_function_parameters([
            'attemptId' => new external_value(PARAM_INT, 'The id of the current attempt'),
        ]);
    }

    /**
     * Retrieves chat messages for a given quiz attempt.
     *
     * @param int $attemptId The ID of the quiz attempt.
     * @return array An array of chat messages, each with 'role' and 'message' keys.
     * @throws moodle_exception If user not enrolled, attempt not valid, curl has errors or mediator returns invalid response
     * @global object $USER
     * @global object $DB
     * @global object $COURSE
     */
    public static function get_chat_messages($attemptId) {
        global $USER, $DB, $COURSE;

        require_login();

        self::validate_parameters(self::get_chat_messages_parameters(), [
            'attemptId' => $attemptId,
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
            'quizId' => $quiz->id
        ];

        $curl = new curl();
        $mediator_ip = get_config('block_sage', 'mediator_address');
        $response = $curl->get($mediator_ip . 'api/chat/get_chat_messages', $data, [
            'CURLOPT_HTTPHEADER' => [
                'Content-Type: application/json',
            ],
        ]);
        if ($curl->get_errno()) {
            throw new moodle_exception('curlerror', 'block_sage', '', $curl->error);
        }

        $messages = json_decode($response, true);

        if (!isset($messages['messages'])) {
            throw new moodle_exception('invalidresponse', 'block_sage');
        }

        return $messages;
    }

    /**
     * Defines the structure of the data returned by the get_chat_messages web service function.
     *
     * @return external_single_structure The return value definition.
     */
    public static function get_chat_messages_returns() {
        return new external_single_structure([
            'messages' => new external_multiple_structure(
                new external_single_structure([
                    'role' => new external_value(PARAM_TEXT, 'Sender\'s role'),
                    'message' => new external_value(PARAM_RAW, 'Message text'),
                ])
            ),
        ]);
    }
}