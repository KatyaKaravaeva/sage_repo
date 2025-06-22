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
 * Parses the current state of the screen, extracting data such as the current answer for coderunner questions
 * and the last time a question was focused.
 *
 * @module     block_sage/questions/screen_parser
 * @copyright  2025 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define(['jquery', 'block_sage/api/focus_api'], function($, focus_api) {
    /**
     * Creates a parser for 'coderunner' type questions which extracts current answer.
     *
     * @returns {{getType: (function(): string), parseQuestionToJson: (function(*): {currentAnswer: *})}}
     */
    function getCoderunnerParser() {
        return {
            getType: function () {
                return "coderunner";
            },
            parseQuestionToJson: function (question) {
                const code = $(question).find('.ace_content').text().trim();
                return {
                    currentAnswer:  code,
                };
            }
        };
    }

    const parsers = [getCoderunnerParser()];

    /**
     * Parses a single question element, extracting common data and type-specific data.
     *
     * @param {Object} question The question DOM element.
     * @returns {Object} The parsed question data.
     */
    function parseQuestion(question) {
        var parseResult = {
            'lastTouched' : focus_api.getLastTimeFocused(question.id)
        };

        for (let j = 0; j < parsers.length; j++) {
            const parser = parsers[j];
            if ($(question).hasClass(parser.getType())) {
                return {
                    ...parseResult,
                    ...parser.parseQuestionToJson(question)
                };
            }
        }
        return parseResult;
    }

    /**
     * Parses all question elements on the page and returns an array of parsed question data.
     *
     * @returns {Array} An array of parsed question data objects.
     */
    function parse() {
        const questions = $(".que");
        const result = [];
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            result.push(parseQuestion(question));
        }
        return result;
    }

    return {
        parse: parse
    };
});