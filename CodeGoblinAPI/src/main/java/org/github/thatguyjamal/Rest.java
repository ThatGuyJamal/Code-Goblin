package org.github.thatguyjamal;

import static spark.Spark.*;
public class Rest {
    public void init() {
       //  port(5678); <- Uncomment this if you want spark to listen to port 5678 instead of the default 4567
        hello();
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
        System.out.println("http://localhost:4567/hello");
    }


}
