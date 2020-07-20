// MATERIALIZECSS RESPONSIVE NAVBAR
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems)
});

// ----------------------------------------------------------------------------------------------------------------------------

// Global Variables
let width = 320;
let height = 0;
let streaming = true;

const picResult = document.querySelector(".result");
const btns = document.querySelectorAll(".btn");
const video = document.querySelector(".responsive-video");
const canvas = document.querySelector(".canvas");
const snap = document.querySelector(".snap");
const videoPlay = document.querySelector(".video");
const videoChild = videoPlay.lastElementChild;

const btnSnap = btns[0].className;
const btnRetake = btns[1].className;
const btnDownload = btns[2].className;

btns[1].className += " disabled";
btns[2].className += " disabled";

// ACCESS VIDEO
navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: false,
    })
    .then(async function (stream) {
        video.srcObject = stream;
        await video.play();
    })

    .catch(function (err) {
        console.log(`Error: ${err}`);
    });

video.addEventListener(
    "canplay",
    function (e) {
        if (streaming) {
            // keep proportion width vs height
            height = video.videoHeight / (video.videoWidth / width);

            // video size
            video.setAttribute("width", width);
            video.setAttribute("height", height);

            // canvas size
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);

            streaming = false;
        }
    },
    false
);


// SNAP EVENT
btns[0].addEventListener(
    "click",
    function (e) {
        takePhoto();
        post_fetch();

        btns[0].className += " disabled";
        btns[1].className = btnRetake;
        btns[2].className = btnDownload;

        e.preventDefault();
    },
    false
);

function takePhoto() {
    const ctx = canvas.getContext("2d");

    // set width and height for canvas
    // draw image
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(video, 0, 0, width, height);

        // create image from canvas BASE64 FORMAT
        const imgURL = canvas.toDataURL("image/png", 1.0);

        // create image element
        const img = document.createElement("img");

        // remove previous snap
        if (snap.lastElementChild) {
            snap.removeChild(snap.lastElementChild);
        }

        // set image source
        img.setAttribute("class", "responsive-img");
        img.setAttribute("src", imgURL);
        img.setAttribute("id", "image-to-classify");

        // append to the snap div
        snap.appendChild(img);

        // once picture is taken, remove video stream
        // videoPlay.removeChild(videoPlay.lastElementChild);
        videoPlay.style.display = "none";

    }
}

// PLACE PREDICTION PICTURE

function result(base64_response) {
    const img_result = document.createElement("img");
    img_result.setAttribute("src", "data:image/jpg;base64," + base64_response)
    picResult.appendChild(img_result)

}

// FUNCTION TO EMBED THE FETCH REQUEST
function post_fetch() {

    // Make prediction by calling api /predict
    let base64_img = canvas.toDataURL("image/jpg", 1.0);
    let base64_enc;
    base64_enc = base64_img.split(",").pop();

    var url = "http://127.0.0.1:8080/predict";
    var data = {
        base64: base64_enc
    };

    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then((res) => res.json())
        .then((response) => result(response["rec_faces"]));

}

// RETAKE PICTURE

btns[1].addEventListener(
    "click",
    function (e) {
        e.preventDefault();
        retake();

        btns[0].className = btnSnap;
        btns[1].className += " disabled";
        btns[2].className += " disabled";


    },
    false
);

function retake() {
    // remove picture
    snap.removeChild(snap.lastElementChild);
    picResult.removeChild(picResult.lastElementChild);
    videoPlay.style.display = 'block'

}

// DOWNLOAD PICTURE

btns[2].addEventListener(
    "click",
    function (e) {
        download();

        e.preventDefault();
    },
    false
);

function download() {
    const dataURL = canvas.toDataURL("image/png", 1.0);
    var a = document.createElement("a");
    a.href = dataURL;
    a.download = "image.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}



// AJAX TO SEND PICTURE FOR PREDICTION

// $(document).ready(function () {

//     $(".snap").click(function (e) {
//         e.preventDefault();

//         // Make prediction by calling api /predict
//         let base64_img = canvas.toDataURL("image/jpg", 1.0);
//         let base64_enc;
//         base64_enc = base64_img.split(",").pop();

//         var url = "http://127.0.0.1:8080/predict";
//         var data = {
//             base64: base64_enc
//         };

//         fetch(url, {
//             method: "POST",
//             body: JSON.stringify(data),
//             headers: {
//                 "Content-Type": "application/json"
//             },
//         })
//             .then((res) => res.json())
//             .then((response) => result(response["rec_faces"]));
//     });
// });