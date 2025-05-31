package com.mestre.weather.Helpers;

import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mestre.weather.Models.HourlyForecast;
import com.mestre.weather.Models.Location;
import com.mestre.weather.Services.GeocodingService;
import com.mestre.weather.Services.OpenMeteoService;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.exceptions.JedisException;

public class CityWeatherHelper {
    private final GeocodingService geocodingService;
    private final OpenMeteoService openMeteoService;

    private final JedisPool jedisPool;
    private final Gson gson;
    private static final int CACHE_EXPIRATION_SECONDS = 900;

    public CityWeatherHelper() {
        geocodingService = new GeocodingService();
        openMeteoService = new OpenMeteoService();

        this.gson = new Gson();

        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(10);
        this.jedisPool = new JedisPool(poolConfig, "localhost", 6379);
    }

    public List<HourlyForecast> get24HourWeatherForecast(String cityName) throws Exception {
        String normalizedCity = cityName.toLowerCase().trim();
        String cacheKey = "weather:" + normalizedCity;

        List<HourlyForecast> cachedForecast = getFromCache(cacheKey);
        if (cachedForecast != null) {
            return cachedForecast;
        }

        List<Location> locations = geocodingService.searchLocations(cityName);
        if (locations.isEmpty()) {
            throw new CityNotFoundException("No coordinates found for city: " + cityName);
        }

        Location location = locations.get(0);
        List<HourlyForecast> forecast = openMeteoService.get24HourForecast(location.getLatitude(),
                location.getLongitude());

        if (!forecast.isEmpty()) {
            saveToCache(cacheKey, forecast);
        }

        return forecast;
    }

    private List<HourlyForecast> getFromCache(String cacheKey) {
        try (Jedis jedis = jedisPool.getResource()) {
            String json = jedis.get(cacheKey);
            if (json == null) {
                return null;
            }
            return gson.fromJson(json, new TypeToken<List<HourlyForecast>>() {
            }.getType());
        } catch (JedisException e) {
            System.err.println("Redis error: " + e.getMessage());
            return null;
        }
    }

    private void saveToCache(String cacheKey, List<HourlyForecast> forecast) {
        try (Jedis jedis = jedisPool.getResource()) {
            String json = gson.toJson(forecast);
            jedis.setex(cacheKey, CACHE_EXPIRATION_SECONDS, json);
        } catch (JedisException e) {
            System.err.println("Redis save error: " + e.getMessage());
        }
    }

    public void shutdown() {
        if (jedisPool != null && !jedisPool.isClosed()) {
            jedisPool.close();
        }
    }

    public static class CityNotFoundException extends Exception {
        public CityNotFoundException(String message) {
            super(message);
        }
    }
}
