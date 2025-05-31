package com.mestre.weather;

import java.io.IOException;

public class App {
    public static void main(String[] args) throws IOException {
        Server server = new Server(8000);
        server.start();
        System.out.println("Server started on port 8000...");
    }
}
