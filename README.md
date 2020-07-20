# Face Detection Web Application using RestrServe R package

- Face detection using the opencv and RestrServe r packages. It captures an image from the video stream and detects faces.
- Application done to get familiar with RestrServe package and have a fully functional application. From my knowledge, this is the first one available.
- The front-end was developed using:
    - [materializecss](https://materializecss.com/)
    - CSS
    - Javascript
    - JQuery
- The back-end was developed using the [RestrServe](https://restrserve.org/) R package

## Launch the application
- Open a new rsession and run the server.R function
- Go to the templates directory and launch the index.html - I use the Live Server extension in Visual Studio Code 




## Notes
### CORS
- To allow CORS in a POST request (I guess the same apply for GET and others)
    - must include app$add_route as follow:
        - app$add_route("/predict", method = "OPTIONS", FUN = function(request, response) {
            response$set_header("Allow", "POST, OPTIONS")
            })
        - /predict :: is the end point
        - OPTIONS must be included
- In the Application$new need to include:
    - middleware = list(CORSMiddleware$new())
    - Also included content_type = "application/json" - it is the response type I am sending back


### Request body
- From the front end web application, I send via fetch a json file
    - Example:
        - var data = {x: 2}
        - then I transformed to json:
            - JSON.stringify(data) which goes in the "body" of the fetch function :: body: JSON.stringify(data)
            - And set the header of the fetch:
                - headers: {
                    "Content-Type": "application/json" // this is the content type I am send to the API
                }

- I am sending a json from the front end web application, so I take the request$body and apply the function jsonlite::fromJSON
    - jsonlite::fromJSON(rawToChar(req$body))
    - This return a R list
    - Example when printed:
    - $x
      [1] 2
        - This is equal to list(x = 2)
    - To access the value of the list
        - jsonlite::fromJSON(rawToChar(req$body))[["x"]]

### Annoying things
- When I got an error in the end point function, I got in the chrome console an error of CORS which is confusing and annoying! Why? Who knows.