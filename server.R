library(RestRserve)
library(opencv)
library(base64enc)


app = Application$new(content_type = "application/json",
                      middleware = list(CORSMiddleware$new()))

# register the end point /predict as a post request
app$add_post(path = "/predict", FUN = function(request, response) {
  
  # image is sent in JSON format and encoded as base64
  x = jsonlite::fromJSON(rawToChar(request$body))
  
  enc_img = x[["base64"]]
  
  # decode the image in base64 format and save in a temp file
  tmp = tempfile()
  writeBin(base64enc::base64decode(enc_img), tmp)
  
  img = ocv_read(tmp)
  
  # this detect the face and draw a circle around
  rec_faces = ocv_face(img)
  
  # this return the (x, y) center point of the face and radius 
  faces = ocv_facemask(img)
  faces_data = attr(faces, "faces")
  
  # create a temp file to save face detection in jpg format
  tmp2 <- tempfile(fileext = ".jpg")
  ocv_write(rec_faces, tmp2)
  
  # make a list of the result to transform in JSON below
  # encode the image as base64 and send to the web app
  result = list(face_data = faces_data, rec_faces = base64enc::base64encode(tmp2))
  
  # set parameters and the body response
  response$set_body(to_json(result))
  
  # remove temp files
  unlink(tmp2)
  unlink(tmp)
  
})


##--------------------------------------------------------------------------------##

# set the CORS
app$add_route("/predict", method = "OPTIONS", FUN = function(request, response) {
  response$set_header("Allow", "POST, OPTIONS")
})


# launch the server in the port 8080
# this block the R session
# to kill the session, in windows use:
# taskkill  /PID 16984 /F
# where 16984 is an example of the PID
# the PID is shown once the below code is run

backend = BackendRserve$new()
backend$start(app, http_port = 8080)