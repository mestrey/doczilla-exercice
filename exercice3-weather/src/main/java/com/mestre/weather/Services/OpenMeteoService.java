package com.mestre.weather.Services;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import com.mestre.weather.Models.HourlyData;
import com.mestre.weather.Models.HourlyForecast;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class OpenMeteoService {
    private static final String BASE_URL = "https://api.open-meteo.com/v1/forecast";
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final Gson gson = new Gson();

    public List<HourlyForecast> get24HourForecast(double latitude, double longitude) throws Exception {
        String url = String.format("%s?latitude=%.6f&longitude=%.6f&hourly=temperature_2m",
                BASE_URL, latitude, longitude);

        HttpResponse<String> response = httpClient.send(
                HttpRequest.newBuilder().uri(URI.create(url)).GET().build(),
                HttpResponse.BodyHandlers.ofString());

        return parseForecast(response.body());
    }

    private List<HourlyForecast> parseForecast(String json) {
        try {
            OpenMeteoResponse response = gson.fromJson(json, OpenMeteoResponse.class);
            if (response == null || response.hourly == null) {
                return Collections.emptyList();
            }

            List<String> times = response.hourly.getTimes();
            List<Double> temperatures = response.hourly.getTemperatures();
            if (times == null || temperatures == null || times.isEmpty()) {
                return Collections.emptyList();
            }

            int startIndex = findCurrentHourIndex(times);
            int endIndex = Math.min(startIndex + 24, times.size());

            List<HourlyForecast> forecasts = new ArrayList<>(24);
            for (int i = startIndex; i < endIndex; i++) {
                forecasts.add(new HourlyForecast(times.get(i), temperatures.get(i)));
            }

            return forecasts;
        } catch (Exception e) {
            System.err.println("Parsing error: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private int findCurrentHourIndex(List<String> timeList) {
        ZonedDateTime now = ZonedDateTime.now(ZoneOffset.UTC)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

        for (int i = 0; i < timeList.size(); i++) {
            try {
                LocalDateTime localTime = LocalDateTime.parse(timeList.get(i), formatter);
                ZonedDateTime timePoint = localTime.atZone(ZoneOffset.UTC);

                if (!timePoint.isBefore(now)) {
                    return i;
                }
            } catch (DateTimeParseException e) {
                System.err.println("Error parsing time: " + timeList.get(i));
            }
        }

        return 0;
    }

    private static class OpenMeteoResponse {
        @SerializedName("hourly")
        HourlyData hourly;
    }
}