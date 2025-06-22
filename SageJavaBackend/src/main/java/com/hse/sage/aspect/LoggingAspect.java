package com.hse.sage.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void controllerMethods() {
    }

    @Before("controllerMethods()")
    public void logBefore(JoinPoint joinPoint) {
        logger.info(
                "The function {} was called with arguments {}",
                joinPoint.getSignature().toShortString(),
                joinPoint.getArgs()
        );
    }

    @AfterReturning(pointcut = "controllerMethods()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        logger.info(
                "The function {} was completed successfully with the result {}",
                joinPoint.getSignature().toShortString(),
                result
        );
    }
}