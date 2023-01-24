package org.github.thatguyjamal;

import static spark.Spark.*;
public class Rest {
    public void init(int _port) {
        port(_port);
        hello();

        System.out.println("http://localhost:" + _port + "/hello/API");
    }
    private static void hello() {
        // matches "GET /hello/foo" and "GET /hello/bar"
        // request.params(":name") is 'foo' or 'bar'
        get("/hello/:name", (request, response) -> {
            // If no params are passed, return "Hello World"
            if (request.params(":name") == null) {
                return "Hello World";
            }
            // If params are passed, return "Hello " + params
            return "Hello " + request.params(":name");
        });
        System.out.println("Running Rest API");
    }


}
