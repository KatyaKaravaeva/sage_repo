package com.hse.sage.exception;

public class CustomServiceException extends RuntimeException {

    public CustomServiceException(String message, Throwable cause) {
        super(message, cause);
    }
    public CustomServiceException(String message){
        super(message);
    }
}