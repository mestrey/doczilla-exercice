package com.mestre.weather.Helpers;

import java.util.List;

import com.mestre.weather.Models.HourlyForecast;
import com.mestre.weather.Models.Location;
import com.mestre.weather.Services.GeocodingService;
import com.mestre.weather.Services.OpenMeteoService;

public class CityWeatherHelper {
    private final GeocodingService geocodingService;
    private final OpenMeteoService openMeteoService;

    public CityWeatherHelper() {
        geocodingService = new GeocodingService();
        openMeteoService = new OpenMeteoService();
    }

    public List<HourlyForecast> get24HourWeatherForecast(String cityName) throws Exception {
        List<Location> locations = geocodingService.searchLocations(cityName);
        if (locations.isEmpty()) {
            throw new CityNotFoundException("No coordinates found for city: " + cityName);
        }
        Location location = locations.get(0);

        return openMeteoService.get24HourForecast(location.getLatitude(), location.getLongitude());
    }

    public static class CityNotFoundException extends Exception {
        public CityNotFoundException(String message) {
            super(message);
        }
    }
}
