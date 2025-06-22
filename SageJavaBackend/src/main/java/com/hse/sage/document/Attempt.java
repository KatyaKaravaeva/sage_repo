package com.hse.sage.document;

import lombok.Data;

@Data
public class Attempt {
    private int attemptId;
    private long timeModified;
    private long lastTouched;
    private AttemptExtraData extraData;
}