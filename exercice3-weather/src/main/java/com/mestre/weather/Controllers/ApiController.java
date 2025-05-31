package com.mestre.weather.Controllers;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.mestre.weather.Router;
import com.mestre.weather.Helpers.CityWeatherHelper;
import com.mestre.weather.Models.HourlyForecast;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class ApiController implements HttpHandler {
    private final CityWeatherHelper weatherHelper;
    private final Gson gson;

    public ApiController() {
        weatherHelper = new CityWeatherHelper();
        gson = new Gson();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (!"GET".equals(exchange.getRequestMethod())) {
            sendResponse(exchange, 405, "Method Not Allowed");
            return;
        }

        try {
            Map<String, String> params = Router.queryToMap(exchange.getRequestURI());
            String city = params.get("city");

            if (city == null || city.isBlank()) {
                sendResponse(exchange, 400, "Missing 'city' parameter");
                return;
            }

            List<HourlyForecast> forecast = weatherHelper.get24HourWeatherForecast(city);

            String response = formatForecastResponse(city, forecast);
            sendResponse(exchange, 200, response);
        } catch (CityWeatherHelper.CityNotFoundException e) {
            sendResponse(exchange, 404, "City not found: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "Internal server error");
        }
    }

    private String formatForecastResponse(String city, List<HourlyForecast> forecast) {
        if (forecast.isEmpty()) {
            return gson.toJson(Map.of("city", city, "message", "No forecast available"));
        }

        DateTimeFormatter dateFormatter = DateTimeFormatter.ISO_LOCAL_DATE;
        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("EEEE");
        List<Map<String, Object>> hourlyData = new ArrayList<>();

        for (HourlyForecast f : forecast) {
            String fullTime = f.getTime();
            LocalDate date = LocalDate.parse(fullTime.substring(0, 10), dateFormatter);

            hourlyData.add(Map.of(
                    "date", date.format(DateTimeFormatter.ISO_DATE),
                    "day", date.format(dayFormatter),
                    "time", fullTime.substring(11, 16),
                    "temperature", f.getTemperature()));
        }

        return gson.toJson(Map.of("city", city, "forecast", hourlyData));
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);

        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
