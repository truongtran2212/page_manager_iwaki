import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button, Checkbox } from "antd";
import {
  SyncOutlined,
  CameraOutlined,
  DeleteOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
// import "./style.css";
// import UploadImagesvg from "../../Images/Upload image (2).svg"

function WindowCamera() {
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [imgSrc, setImgSrc] = useState("");
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [imageUrls, setImageUrls] = useState([]);
  const [checked, setChecked] = useState(false);

  const constraints = {
    video: {
      facingMode: facingMode,
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
    audio: false,
  };
  const setDisabled = useCallback(() => {
    if (imgSrc !== null && imgSrc !== "") {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [imgSrc]);

  // Gọi hàm setDisabled khi imgSrc thay đổi
  useEffect(() => {
    setDisabled();
  }, [imgSrc, setDisabled]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            if (canvasRef.current) {
              const actualWidth = videoRef.current.videoWidth;
              const actualHeight = videoRef.current.videoHeight;

              const track = mediaStream.getVideoTracks()[0];
              const settings = track.getSettings();
              const { width, height } = settings;

              const aspectRatio = width / height;

              if (aspectRatio > 1) {
                canvasRef.current.width = actualWidth;
                canvasRef.current.height = actualWidth / aspectRatio;
              } else {
                canvasRef.current.width = actualHeight * aspectRatio;
                canvasRef.current.height = actualHeight;
              }
            }
          };
          navigator.mediaDevices.enumerateDevices().then((devices) => {
            const hasFrontCamera = devices.some(
              (device) =>
                (device.kind === "videoinput" &&
                  device.label.toLowerCase().includes("front")) ||
                device.label.toLowerCase().includes("trước")
            );
            const hasBackCamera = devices.some(
              (device) =>
                (device.kind === "videoinput" &&
                  device.label.toLowerCase().includes("back")) ||
                device.label.toLowerCase().includes("sau")
            );
            if (
              (isFrontCamera && !hasBackCamera) ||
              (!isFrontCamera && !hasFrontCamera)
            ) {
              const newFacingMode = "user";
              setFacingMode(newFacingMode);
            }
          });
        }
      } catch (err) {
        // alert('Không tìm thấy camera');
        console.error("Error accessing the camera:", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [facingMode]);

  const captureImage = () => {
    if (isSwitchingCamera) {
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      if (facingMode === "user") {
        context.scale(-1, 1);
        context.translate(-canvas.width, 0);
      }
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      context.restore();
      const imageData = canvas.toDataURL("image/png", 1);
      console.log(imageData);
      setImgSrc(imageData);
      localStorage.setItem("fileName", "fileName.png");
      localStorage.setItem("ImageData", imageData);
    }
  };

  const switchCamera = useCallback(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const hasFrontCamera = devices.some(
          (device) =>
            (device.kind === "videoinput" &&
              device.label.toLowerCase().includes("front")) ||
            device.label.toLowerCase().includes("trước")
        );
        const hasBackCamera = devices.some(
          (device) =>
            (device.kind === "videoinput" &&
              device.label.toLowerCase().includes("back")) ||
            device.label.toLowerCase().includes("sau")
        );

        if (
          (isFrontCamera && !hasBackCamera) ||
          (!isFrontCamera && !hasFrontCamera)
        ) {
          // alert("Không có camera để đổi");
          return;
        }
        setIsFrontCamera((prev) => !prev);

        if (videoRef.current) {
          setIsSwitchingCamera(true);
          setFacingMode(facingMode === "environment" ? "user" : "environment");
          setTimeout(() => {
            setIsSwitchingCamera(false);
          }, 1000);
        }
      })
      .catch((error) => {
        console.error("Error enumerating devices:", error);
      });
  });

  const clearImage = () => {
    setImgSrc(null);
  };

  const uploadImage = async () => {
    // const getFileCapture = localStorage.getItem("ImageData");
    // const nameFile = localStorage.getItem("fileName");

    // const byteCharacters = atob(getFileCapture.split(",")[1]);

    // const byteNumbers = new Array(byteCharacters.length);

    // for (let i = 0; i < byteCharacters.length; i++) {
    //   byteNumbers[i] = byteCharacters.charCodeAt(i);
    // }

    // const byteArray = new Uint8Array(byteNumbers);

    // const buffer = byteArray.buffer;

    // const blob = new Blob([buffer], { type: "image/png" });

    // const getFile = new File([blob], nameFile, { type: "image/png" });

    // console.log(getFile);
    // const prioriti = checked ? "1" : "0";
    // console.log(checked);
    // console.log(prioriti);

    // const FormData = require("form-data");

    // let data = new FormData();

    // data.append("file_upload", getFile);

    // data.append("prioriti", prioriti);

    // axios
    //   .post("http://192.168.10.22:5009/upload_file", data)
    //   .then((response) => {
    //     console.log(JSON.stringify(response.data));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };
  const onChangeCheckBox = (e) => {
    console.log("checked = ", e.target.checked);
    setChecked(e.target.checked);
  };
  return (
    <>
      <div className="contentWindow">
        <div className="cameraWindow container">
          <div className="showCameraWindow">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                transform: facingMode === "user" ? "scaleX(-1)" : "none",
              }}
            />
          </div>
          <div className="buttonCameraWindow">
            <Button
              className="btnCamera"
              type="primary"
              icon={<SyncOutlined style={{ fontSize: "48px" }} />}
              onClick={switchCamera}
            />
            <Button
              className="btnCamera"
              type="primary"
              icon={<CameraOutlined style={{ fontSize: "48px" }} />}
              onClick={captureImage}
            />

            <Button
              className="btnCamera"
              type="primary"
              icon={<DeleteOutlined style={{ fontSize: "48px" }} />}
              onClick={clearImage}
            />
          </div>
        </div>
        <div className="contentImageWindow container">
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          {imgSrc ? (
            <>
              <div className="showImageWindow">
                <img src={imgSrc} alt="Captured" />
              </div>
              <div className="ButtonImageWindow">
                <form>
                  <Button
                    className="btnUpload"
                    type="primary"
                    onClick={uploadImage}
                    icon={<CloudUploadOutlined style={{ fontSize: "48px" }} />}
                  />
                  {/* <img className="btnUpload" src={UploadImagesvg} alt="UploadImagesvg"
                  onClick={uploadImage}
                  style={{ width:"100%" }}
                /> */}
                  <Checkbox
                    onChange={onChangeCheckBox}
                    checked={checked}
                  ></Checkbox>
                </form>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default WindowCamera;
