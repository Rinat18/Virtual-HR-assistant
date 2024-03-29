import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./index.css";

export default function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [emotion, setEmotion] = useState();
  const [question, setQuestion] = useState("Что такое циклы?");
  const [answer, setAnswer] = useState("");
  const [answerUser, setAnswerUswer] = useState(answer);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    startVideo();
    videoRef && loadModels();
    // ! ТЕМА
    // const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    // setTheme(prefersDarkScheme.matches ? "dark" : "light");

    // const handleChange = (event) => {
    //   setTheme(event.matches ? "dark" : "light");
    // };

    // prefersDarkScheme.addEventListener("change", handleChange);

    // return () => {
    //   prefersDarkScheme.removeEventListener("change", handleChange);
    // };
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(() => {
      faceMyDetect();
    });
  };
  const faceMyDetect = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        videoRef.current
      );
      faceapi.matchDimensions(canvasRef.current, {
        width: 940,
        height: 650,
      });
      const resized = faceapi.resizeResults(detections, {
        width: 940,
        height: 650,
      });
      console.log();
      if (detections[0]) {
        if (detections[0].expressions.happy > 0.8) {
          console.log("вы радостный");
          // setQuestion("Что то хорошое случилось?");
          setEmotion("happy");
        }
        if (detections[0].expressions.angry > 0.8) {
          console.log("вы Злитесь");
          // setQuestion("Вы на что злитесь?");
          setEmotion("angry");
        }
        if (detections[0].expressions.fearful > 0.8) {
          console.log("вам срашно");
          setEmotion("fearful");
        }
        if (detections[0].expressions.sad > 0.8) {
          console.log("вы грустный");
          // setQuestion("Вас кто то обидел?");
          setEmotion("sad");
        }
        if (detections[0].expressions.disgusted > 0.8) {
          console.log("вам противно");
          setEmotion("disgusted");
        }
        if (detections[0].expressions.surprised > 0.8) {
          console.log("вы удивлены");
          setEmotion("surprised");
        }
      }

      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
    }, 1000);
  };

  // ! EMOTIONS
  const emotions = [];
  console.log(emotions);
  useEffect(() => {
    console.log(emotion);
    console.log(emotions);
    emotions.push(emotion);
  }, [emotion]);

  useEffect(() => {
    if (
      answerUser ==
      "это блок кода который повторяет сам себя пока заданное условие правильное"
    ) {
      setQuestion("Что такое условый оператор?");
    } else if (
      answerUser == "это блок кода которые сработает если условие правильное"
    ) {
      setQuestion("Что такое useState?");
    } else if (answerUser == "это хук реакта ") {
      setQuestion("Ваши ответы записанны ожидайте результаты.");
    }
  }, [answerUser]);

  const clean = () => {
    setAnswerUswer(answer);
    setAnswer("");
  };

  return (
    <div className="myapp">
      <div className="videoLeft">
        <div style={{ color: "#7d10a4" }} className="videoLeft_container">
          <h1>HR ASSISTANT</h1>
          <div className="appvide">
            <video
              className="videoR"
              crossOrigin="anonymous"
              ref={videoRef}
              autoPlay
            ></video>
          </div>
        </div>
        <canvas ref={canvasRef} className="appcanvas" />
      </div>
      <div className="textRight">
        <div style={{width:"80%"}}>
          <h2 style={{ color: "#fff" }}>{question}</h2>
          <div className="inp">
            <textarea
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
              type="text"
            />{" "}
            <button onClick={() => clean()}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
