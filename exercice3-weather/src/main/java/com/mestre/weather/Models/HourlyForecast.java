package com.mestre.weather.Models;

public class HourlyForecast {
    private String time;
    private Double temperature;

    public HourlyForecast(String time, Double temperature) {
        this.time = time;
        this.temperature = temperature;
    }

    public String getTime() {
        return time;
    }

    public Double getTemperature() {
        return temperature;
    }
}