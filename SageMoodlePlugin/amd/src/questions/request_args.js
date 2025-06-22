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
 * Extracts information from the current URL and the quiz page content to construct arguments for server requests.
 * This includes the attempt ID, page number, and parsed question data.
 *
 * @module     block_sage/questions/request_args
 * @copyright  2025 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define(['block_sage/questions/screen_parser'], function(parser) {
    /**
     * Extracts the attempt ID from the current URL.
     *
     * @returns {{attemptId: string} | null} An object containing the attemptId, or null if not found.
     */
    function getAttemptFromURL(){
        const attemptMatch = window.location.href.match(/attempt=(\d+)/);

        if(attemptMatch===null || attemptMatch.length<2){
           return null;
        }
        return {attemptId: attemptMatch[1]};
    }

    /**
     * Constructs a request object containing data from the URL and the parsed quiz page content.
     *
     * @returns {{attemptId: string, page: string, extraData: Array} | null}  The request object, or null if the attempt ID is not found.
     */
    function getRequestWithData(){
        const attemptArgs = getAttemptFromURL();
        if(attemptArgs===null){
            return null;
        }

        const pageMatch = window.location.href.match(/page=(\d+)/);
        if(pageMatch===null || pageMatch.length<2){
            attemptArgs["page"] = 0;
        } else {
            attemptArgs["page"] = pageMatch[1];
        }

        attemptArgs["extraData"] = parser.parse();
        return attemptArgs;
    }

    return {
        getAttemptFromURL: getAttemptFromURL,

        getRequestWithData: getRequestWithData,
    };
});