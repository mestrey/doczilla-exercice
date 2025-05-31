package com.mestre.weather.Models;

public class Location {
    private String name;
    private double latitude;
    private double longitude;
    private String country;

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public String getName() {
        return name;
    }

    public String getCountry() {
        return country;
    }
}
