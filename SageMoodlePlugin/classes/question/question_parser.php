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

namespace block_sage\question;

require_once($CFG->libdir . '/externallib.php');
require_once($CFG->libdir . '/filelib.php');
require_once($CFG->libdir . '/enrollib.php');
require_once($CFG->libdir . '/accesslib.php');
require_once($CFG->dirroot . '/mod/quiz/locallib.php');

/**
 * Parses question and attempt data for a given quiz attempt and page.
 * Uses a pluggable architecture to handle different question types.
 *
 * @package    block_sage\question
 * @copyright  2025 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class question_parser {
    /**
     * Retrieves information about questions on a specific page of a quiz attempt.
     *
     * @param int $attemptid The quiz attempt ID.
     * @param int $page The page number.
     * @param array $extraData Additional data from the frontend.
     * @return array An array of question and attempt data.
     * @global object $DB
     */
    public static function get_question_info($attemptid, $page, $extraData) {
        global $DB;

        $attempt = $DB->get_record('quiz_attempts', ['id' => $attemptid], '*', MUST_EXIST);

        $attemptobj = \quiz_attempt::create($attempt->id);

        $slots = $attemptobj->get_slots($page);

        $questions = [];
        $counter = 0;

        $questionTypeHandlers = [
            coderunner_question_type::class => new coderunner_question_type(),
        ];


        foreach ($slots as $slot) {
            $qa = $attemptobj->get_question_attempt($slot);
            $question = $qa->get_question();

            $question_data = [
                'questionId' => $question->id,
                'questionName' => $question->name,
                'timeModified' => $question->timemodified,
                'questionText' => $question->questiontext,
            ];

            $attempt_data = [
                'attemptId' => $attemptid,
                'timeModified' => $qa->timemodified,
                'lastTouched' => $extraData[$counter]['lastTouched'],
            ];

            $questionType = null;
            foreach ($questionTypeHandlers as $handler) {
                if ($question instanceof ($handler->get_question_type_class())) {
                    $questionType = $handler;
                    break;
                }
            }


            if ($questionType) {
                $question_data['extraData'] = $questionType->get_question_extra_data($question);
                $attempt_data['extraData'] = $questionType->get_attempt_extra_data($qa, $extraData[$counter]);
            }


            $questions[] = [
                'question' => $question_data,
                'attempt' => $attempt_data
            ];
            $counter++;
        }

        return $questions;
    }
}