import{DrawingUtils as v,FilesetResolver as b,HandLandmarker as w}from"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function i(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(t){if(t.ep)return;t.ep=!0;const a=i(t);fetch(t.href,a)}})();const k=document.getElementById("webcamButton"),s=document.getElementById("webcam"),L=document.getElementById("output_canvas"),E=L.getContext("2d"),c=document.getElementById("dataOutput"),O=document.getElementById("checkButtonNn"),B=document.getElementById("requestedLetter");new v(E);let g,h=!1,o,d="",x=document.querySelector("#myimage"),u=[],m;const I=async()=>{const e=await b.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");g=await w.createFromOptions(e,{baseOptions:{modelAssetPath:"https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",delegate:"GPU"},runningMode:"VIDEO",numHands:1}),console.log("model loaded, you can start webcam"),k.addEventListener("click",i=>M()),O.addEventListener("click",()=>C(N())),ml5.setBackend("webgl"),m=ml5.neuralNetwork({task:"classification",debug:!0});const n={model:"model/model.json",metadata:"model/model_meta.json",weights:"model/model.weights.bin"};m.load(n,()=>console.log("het model is geladen!")),y()};async function M(){h=!0;try{const e=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1});s.srcObject=e,s.addEventListener("loadeddata",()=>{p()})}catch(e){console.error("Error accessing webcam:",e)}}async function p(){o=await g.detectForVideo(s,performance.now());let e=o.landmarks[0];if(e){let n=e[4];x.style.transform=`translate(${s.videoWidth-n.x*s.videoWidth}px, ${n.y*s.videoHeight}px)`}h&&window.requestAnimationFrame(p)}function N(){if(!o||!o.landmarks||o.landmarks.length===0)return console.warn("Geen handdata beschikbaar op dit moment."),[];for(let e of o.landmarks){const n=e[0];u=e.map(({x:r,y:t,z:a})=>({x:r-n.x,y:t-n.y,z:a-n.z})).flatMap(({x:r,y:t,z:a})=>[r,t,a]),console.log(o.landmarks)}return u}async function C(e){const n=await m.classify(e);P(n[0].label)}function y(){const e=["a","b","c","d","e","f","h","i"],n=Math.floor(Math.random()*e.length);d=e[n],B.textContent=`Maak het gebaar voor: "${d}"`}function P(e){c.classList.remove("correct","incorrect"),e===d?(c.textContent="Correct!",c.classList.add("correct"),y()):(c.textContent=`Incorrect, Je maakte het gebaar voor: "${e}", in plaats van: "${d}"`,c.classList.add("incorrect"))}var f;(f=navigator.mediaDevices)!=null&&f.getUserMedia&&I();
