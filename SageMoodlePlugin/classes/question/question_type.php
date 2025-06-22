<?php

namespace block_sage\question;

/**
 * Interface questiontype
 *
 * Defines the interface for question type implementations.
 *
 * @package    block_sage\helper
 * @copyright  2025 Vasilevskiy Vladimir <vivasilevskiy_1@edu.hse.ru>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
interface question_type {
    /**
     * Returns the question type class (e.g., \qtype_coderunner_question).
     *
     * @return string The class name of the question type.
     */
    public function get_question_type_class(): string;

    /**
     * Collects extra data from the question object.
     *
     * @param \question_definition $question The question object.
     * @return array An associative array of extra data.
     */
    public function get_question_extra_data(\question_definition $question): array;

    /**
     * Collects extra data from the question attempt object.
     *
     * @param \question_attempt $qa The question attempt object.
     * @param array $extraData Additional data from the frontend.
     * @return array An associative array of extra attempt data.
     */
    public function get_attempt_extra_data(\question_attempt $qa, array $extraData): array;
}