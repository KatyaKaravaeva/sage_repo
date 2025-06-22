package com.hse.sage.document;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.TypeAlias;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@TypeAlias("coderunnerQuestionExtraData")
public class CodeRunnerQuestionExtraData extends QuestionExtraData {
    private String language;
    private String answer;
    private List<TestCase> testCases;
}