package com.mestre.weather.Models;

import java.util.List;
import com.google.gson.annotations.SerializedName;

public class HourlyData {
    @SerializedName("time")
    private List<String> times;

    @SerializedName("temperature_2m")
    private List<Double> temperatures;

    public List<String> getTimes() {
        return times;
    }

    public List<Double> getTemperatures() {
        return temperatures;
    }
}