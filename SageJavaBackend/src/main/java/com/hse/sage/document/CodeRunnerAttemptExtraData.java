package com.hse.sage.document;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.TypeAlias;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@TypeAlias("coderunnerAttemptExtraData")
public class CodeRunnerAttemptExtraData extends AttemptExtraData {
    private String currentAnswer;
    private String submittedAnswer;
    private List<AttemptTestCase> testCases;
}