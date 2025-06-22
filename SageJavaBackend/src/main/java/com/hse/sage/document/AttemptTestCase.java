package com.hse.sage.document;

import lombok.Data;

@Data
public class AttemptTestCase {
    private String stdin;
    private String expected;
    private String got;
    private boolean correct;
    private String visibility;
}
