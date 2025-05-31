package com.mestre.weather.Services;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Collections;
import java.util.List;

import com.google.gson.Gson;
import com.mestre.weather.Models.Location;

public class GeocodingService {
    private static final String BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final Gson gson = new Gson();

    public List<Location> searchLocations(String cityName) throws Exception {
        String encodedName = cityName.replace(" ", "%20");
        String url = String.format("%s?name=%s", BASE_URL, encodedName);

        HttpResponse<String> response = httpClient.send(
                HttpRequest.newBuilder().uri(URI.create(url)).GET().build(),
                HttpResponse.BodyHandlers.ofString());

        return parseResponse(response.body());
    }

    private List<Location> parseResponse(String json) {
        GeocodingResponse response = gson.fromJson(json, GeocodingResponse.class);

        return (response != null && response.getResults() != null)
                ? response.getResults()
                : Collections.emptyList();
    }

    private static class GeocodingResponse {
        private List<Location> results;

        public List<Location> getResults() {
            return results;
        }
    }
}
