package com.mestre.weather;

import java.io.IOException;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpServer;

public class Server {
    private HttpServer server;
    private Router router;

    public Server(int port) throws IOException {
        server = HttpServer.create(new InetSocketAddress(8000), 0);

        router = new Router();
        router.setRoutes(server);
    }

    public void start() {
        server.setExecutor(null);
        server.start();
    }
}
