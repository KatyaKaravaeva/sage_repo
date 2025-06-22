package com.hse.sage.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Map;
import lombok.Data;

@Component
@ConfigurationProperties(prefix = "backend")
@Data
public class BackendConfig {

    private List<AdapterConfig> adapters;
    private Map<Integer, String> mapping;


    @Data
    public static class AdapterConfig {
        private String name;
        private String type;
        private String url;
    }
}