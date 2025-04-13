import { HandLandmarker, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18";

const enableWebcamButton = document.getElementById("webcamButton")

const video = document.getElementById("webcam")
const canvasElement = document.getElementById("output_canvas")
const canvasCtx = canvasElement.getContext("2d")

const dataOutput = document.getElementById("dataOutput")
const checkButtonNn = document.getElementById("checkButtonNn")
const requestedLetter = document.getElementById("requestedLetter")

const drawUtils = new DrawingUtils(canvasCtx)
let handLandmarker = undefined;
let webcamRunning = false;
let results = undefined;
let chosenLetter = ""

let image = document.querySelector("#myimage")
let flatData = []
let nn;


/********************************************************************
 // CREATE THE POSE DETECTOR
 ********************************************************************/
const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1
    });
    console.log("model loaded, you can start webcam")

    enableWebcamButton.addEventListener("click", (e) => enableCam(e))
    checkButtonNn.addEventListener("click",() => classifyPoseNn(dataToArray()))


    ml5.setBackend("webgl");
    nn = ml5.neuralNetwork({ task: 'classification', debug: true })
    const modelDetails = {
        model: 'model/model.json',
        metadata: 'model/model_meta.json',
        weights: 'model/model.weights.bin'
    }
    nn.load(modelDetails, () => console.log("het model is geladen!"))

    setLetter()
}

/********************************************************************
 // START THE WEBCAM
 ********************************************************************/
async function enableCam() {
    webcamRunning = true;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
        video.addEventListener("loadeddata", () => {
            // canvasElement.width = video.videoWidth;
            // canvasElement.height = video.videoHeight;
            // canvasElement.style.width = `${video.videoWidth * 0.5}px`;
            // canvasElement.style.height = `${video.videoHeight * 0.5}px`;
            // document.querySelector(".videoView").style.height = video.videoHeight * 0.5+ "px";
            predictWebcam();
        });
    } catch (error) {
        console.error("Error accessing webcam:", error);
    }
}

/********************************************************************
 // START PREDICTIONS
 ********************************************************************/
async function predictWebcam() {
    results = await handLandmarker.detectForVideo(video, performance.now())

    let hand = results.landmarks[0]
    if(hand) {
        let thumb = hand[4]
        image.style.transform = `translate(${video.videoWidth - thumb.x * video.videoWidth}px, ${thumb.y * video.videoHeight}px)`
    }

    if (webcamRunning) {
        window.requestAnimationFrame(predictWebcam)
    }
}

function dataToArray(){
    if (!results || !results.landmarks || results.landmarks.length === 0) {
        console.warn("Geen handdata beschikbaar op dit moment.");
        return [];
    }

    for (let hand of results.landmarks) {
        const wrist = hand[0];
        const relativeHand = hand.map(({x, y, z}) => ({
            x: x - wrist.x,
            y: y - wrist.y,
            z: z - wrist.z
        }));
        flatData = relativeHand.flatMap(({x, y, z}) => [x, y, z])
        console.log(results.landmarks)
    }
    return flatData
}

async function classifyPoseNn(pose) {
    const result = await nn.classify(pose)
    checkLetter(result[0].label)
}

function setLetter(){
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'h', 'i']
    const randNum = Math.floor(Math.random() * letters.length)

    chosenLetter = letters[randNum]

    requestedLetter.textContent = `Maak het gebaar voor: "${chosenLetter}"`
}

function checkLetter(poseLetter){
    dataOutput.classList.remove("correct", "incorrect");

    if (poseLetter === chosenLetter){
        dataOutput.textContent = "Correct!";
        dataOutput.classList.add("correct");
        setLetter();
    } else {
        dataOutput.textContent = `Incorrect, Je maakte het gebaar voor: "${poseLetter}", in plaats van: "${chosenLetter}"`;
        dataOutput.classList.add("incorrect");
    }
}


/********************************************************************
 // START THE APP
 ********************************************************************/
if (navigator.mediaDevices?.getUserMedia) {
    createHandLandmarker()
}

