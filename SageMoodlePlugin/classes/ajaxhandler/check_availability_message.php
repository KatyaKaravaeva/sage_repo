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
 * Defines the Moodle external API for checking the availability of the Sage service.
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

class check_availability_message extends external_api {


    /**
     * Defines the parameters expected by the check_availability_message web service function. (None in this case).
     * @return external_function_parameters
     */
    public static function check_availability_message_parameters() {
        return new external_function_parameters([]);
    }

    /**
     * Checks the availability of the Sage service by sending a request to the mediator.
     *
     * @return array  An array containing the 'available' status (boolean).
     * @throws moodle_exception If mediator returns invalid response
     */
    public static function check_availability_message() {
        global $COURSE;
        require_login();

        $courseid = $COURSE->id;

        $data = [
            'courseId' => $courseid
        ];

        $mediator_ip = get_config('block_sage', 'mediator_address');

        $curl = new curl();

        $response = $curl->get($mediator_ip . 'api/status/check_availability', $data, [
            'CURLOPT_HTTPHEADER' => [
                'Content-Type: application/json',
            ],
        ]);


        $message = json_decode($response, true);

        if (!isset($message['available'])) {
            throw new moodle_exception('invalidresponse', 'block_sage');
        }

        return $message;
    }

    /**
     * Defines the structure of the data returned by the check_availability_message web service function.
     *
     * @return external_single_structure The return value definition.
     */
    public static function check_availability_message_returns() {
        return new external_single_structure([
            'available' => new external_value(PARAM_BOOL, 'Availability status')
        ]);
    }
}