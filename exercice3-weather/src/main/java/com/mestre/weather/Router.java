package com.mestre.weather;

import java.net.URI;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import com.mestre.weather.Controllers.ApiController;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class Router {
    private static Map<String, HttpHandler> routes = new HashMap<>() {
        {
            put("/weather", new ApiController());
        }
    };

    public void setRoutes(HttpServer server) {
        for (Map.Entry<String, HttpHandler> entry : routes.entrySet()) {
            String path = entry.getKey();
            HttpHandler handler = entry.getValue();
            server.createContext(path, handler);
        }
    }

    public static Map<String, String> queryToMap(URI uri) {
        String query = uri.getQuery();
        if (query == null || query.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<String, String> result = new HashMap<>();
        for (String param : query.split("&")) {
            String pair[] = param.split("=");
            if (pair.length > 1) {
                result.put(pair[0], pair[1]);
            } else {
                result.put(pair[0], "");
            }
        }

        return result;
    }
}
