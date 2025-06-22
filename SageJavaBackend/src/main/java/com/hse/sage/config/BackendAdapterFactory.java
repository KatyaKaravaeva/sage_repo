package com.hse.sage.config;

import com.hse.sage.adapters.BackendAdapter;
import com.hse.sage.adapters.PythonDemoAdapter;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;


@Component
public class BackendAdapterFactory implements InitializingBean {

    @Autowired
    private BackendConfig backendConfig;
    @Autowired
    private RestTemplate restTemplate;

    private final Map<String, BackendAdapter> adapters = new HashMap<>();

    @Override
    public void afterPropertiesSet() {
        for (BackendConfig.AdapterConfig config : backendConfig.getAdapters()) {

        }
    }

    public BackendAdapter getAdapter(int courseId) {
        String adapterName = backendConfig.getMapping().get(courseId);
        if (adapterName == null) {
            throw new IllegalArgumentException("No backend adapter configured for courseId: " + courseId);
        }
        BackendAdapter adapter = adapters.get(adapterName);
        if (adapter == null) {
            throw new IllegalArgumentException("No backend adapter found with name: " + adapterName);
        }
        return adapter;
    }

}