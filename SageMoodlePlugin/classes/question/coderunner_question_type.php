<?php

namespace block_sage\question;

/**
 * Implements the question_type interface for Coderunner questions.
 *  Provides methods to extract data specific to Coderunner questions and attempts.
 *
 * @package    block_sage\question
 * @copyright  2025 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class coderunner_question_type implements question_type {
    /**
     * Returns the question type class for Coderunner questions.
     *
     * @return string The class name (\qtype_coderunner_question).
     */
    public function get_question_type_class(): string {
        return \qtype_coderunner_question::class;
    }

    /**
     * Extracts extra data specific to a Coderunner question.
     *
     * @param \question_definition $question The question object.
     * @return array An associative array of extra data.
     */
    public function get_question_extra_data(\question_definition $question): array {
        return [
            'language' => $question->language,
            'type' => get_class($question->qtype),
            'answer' => $question->answer,
            'testCases' => $this->get_tests_from_question($question),
        ];
    }

    /**
     * Extracts extra data specific to a Coderunner question attempt.
     *
     * @param \question_attempt $qa The question attempt object.
     * @param array $extraData Additional data from the frontend.
     * @return array An associative array of extra attempt data.
     */
    public function get_attempt_extra_data(\question_attempt $qa, array $extraData): array {
        $attemptData = [
            'currentAnswer' => $extraData['currentAnswer'],
            'type' => get_class($qa->get_question()->qtype),
            'testCases' => $this->get_tests_from_attempt($qa),
        ];
        if ($qa->get_last_qt_var('answer') != null) {
            $attemptData['submittedAnswer'] = $qa->get_last_qt_var('answer');
        }
        return $attemptData;
    }

    /**
     * Retrieves test cases from a Coderunner question.
     *
     * @param \question_definition $question The Coderunner question object.
     * @return array An array of test case data.
     */
    protected function get_tests_from_question(\question_definition $question): array {
        $tests = [];
        foreach ($question->testcases as $test) {
            $tests[] = [
                'id' => $test->id,
                'stdin' => $test->stdin,
                'expected' => $test->expected,
                'visibility' => $test->display,
            ];
        }
        return $tests;
    }

    /**
     * Retrieves test results from a Coderunner question attempt.
     *
     * @param \question_attempt $qa The question attempt object.
     * @return array An array of test result data.
     */
    protected function get_tests_from_attempt(\question_attempt $qa): array {
        $tests = [];
        if ($qa->get_last_qt_var('_testoutcome') == null) {
            return [];
        }
        $qa_tests = unserialize($qa->get_last_qt_var('_testoutcome'));
        foreach ($qa_tests->testresults as $test) {
            $tests[] = [
                'stdin' => $test->stdin,
                'expected' => $test->expected,
                'got' => $test->got,
                'correct' => $test->iscorrect,
                'visibility' => $test->display,
            ];
        }
        return $tests;
    }
}