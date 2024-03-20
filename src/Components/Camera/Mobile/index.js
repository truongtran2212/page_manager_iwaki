import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
// import "./style.css";
import {
  // Button,
  Col,
  Row,
  Checkbox,
  Button,
  Modal,
} from "antd";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SwipeableViews from "react-swipeable-views";
import UploadImagesvg from "../../../Images/Upload image (2).svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { useSelector } from "react-redux";
import iconUpload from "../../../Images/uploadPhotosLinear.svg";
import iconImportant from "../../../Images/prioritizeLinear.svg";
import iconClose from "../../../Images/iconClose.svg";
import { localhost } from "../../../server";
import { SyncOutlined } from "@ant-design/icons";

const MobileWebCam = () => {
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [imgSrc, setImgSrc] = useState();
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [isCaptureLoad, setIsCaptureLoad] = useState(false);

  // const [rotate, setRotate] = useState(0);
  // const [isImgFullScreen, setIsImgFullScreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isDisabledSwip, setIsDisabledSwip] = useState(true);
  const [checkImg, setCheckImg] = useState(false);
  const [checked, setChecked] = useState(false);
  const [disabledApp, setDisabledApp] = useState(true);
  const [checkViewImg, setCheckViewImg] = useState(false);
  const [isImgFullScreen, setIsImgFullScreen] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const userInfo = useSelector((state) => state.user);
  const [isModalImageVisible, setIsModalImageVisible] = useState(false);
  const [isModalDeleteImage, setIsModalDeleteImage] = useState(false);
  const [isPrioritize, setIsPrioritize] = useState(false);

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
              // Get actual video dimensions
              const actualWidth = videoRef.current.videoWidth;
              const actualHeight = videoRef.current.videoHeight;

              // Get video stream settings
              const track = mediaStream.getVideoTracks()[0];
              const settings = track.getSettings();
              const { width, height } = settings;

              // Calculate aspect ratio
              const aspectRatio = width / height;

              // Adjust canvas size based on aspect ratio
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
            setDisabledApp(false);
          });
        }
      } catch (err) {
        alert("Không tìm thấy camera");
        setDisabledApp(true);
        // console.error("Error accessing the camera:", err);
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
  }, [facingMode, checkImg]);
  const toggleChecked = () => {
    setChecked(!checked);
  };

  const handleCancel = () => {
    setIsModalImageVisible(false);
  };

  const showModalDelete = () => {
    setIsModalDeleteImage(true);
  };
  const handleDeleteOK = () => {
    setIsModalDeleteImage(false);
  };
  const buttonPrioritize = () => {
    isPrioritize ? setIsPrioritize(false) : setIsPrioritize(true);
    // setIsPrioritize(true);
  };

  const handleDeleteCancel = () => {
    setIsModalDeleteImage(false);
  };
  const onClickCheckImage = (imageName) => {
    console.log("click");
    const updatedImages = imageList.map((image) =>
      image.imageName === imageName
        ? { ...image, imageCheck: !image.imageCheck }
        : { ...image }
    );
    setImageList(updatedImages);

    console.log(updatedImages);
  };
  const countCheckedImages = () => {
    return imageList.filter((image) => image.imageCheck).length;
  };
  const handleDeleteImagesOk = () => {
    const updatedImages = imageList.filter((image) => !image.imageCheck);
    setImageList(updatedImages);
    setIsModalDeleteImage(false);
  };
  const constraints = {
    video: {
      facingMode: facingMode,
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
    audio: false,
  };
  window.onpopstate = function () {
    setIsImgFullScreen(false);
  };
  const showModal = () => {
    // Assuming imageList is your array of imageInfo objects
    // const lastImageBase64 =
    //   imageList.length > 0 ? imageList[imageList.length - 1].imageBase64 : null;

    // // Now you can use lastImageBase64 as needed
    // console.log("Last Image Base64:", lastImageBase64);

    setIsModalImageVisible(true);
  };

  const handleDeleteImage = (imageName) => {
    const updatedImageList = imageList.filter(
      (image) => image.imageName !== imageName
    );
    setImageList(updatedImageList);
    if (updatedImageList.length === 0) {
      setOpenModal(false);
    }
  };

  // const disabledSwip = useCallback(
  //   (setImgSrc) => {
  //     if (setImgSrc !== null && setImgSrc !== undefined && setImgSrc !== "") {
  //       setIsDisabledSwip(false);
  //     } else {
  //       setIsDisabledSwip(true);
  //     }
  //   },
  //   [setImgSrc]
  // );
  // const disabledCapture = useCallback(
  //   (setImgSrc) => {
  //     if (setImgSrc !== null && setImgSrc !== undefined && setImgSrc !== "") {
  //       setCheckImg(true);
  //     } else {
  //       setCheckImg(false);
  //     }
  //   },
  //   [setImgSrc]
  // );

  const captureImage = () => {
    try {
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
        // // video.load();
        const imageData = canvas.toDataURL("image/png", 1);
        // setImgSrc(imageData);
        // localStorage.setItem("fileName", "fileName.png");
        // localStorage.setItem("ImageData", imageData);
        // console.log(imageData);
        // disabledCapture(setImgSrc);
        const now = new Date();

        const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
        const month =
          now.getMonth() + 1 < 10
            ? `0${now.getMonth() + 1}`
            : now.getMonth() + 1;
        const year = String(now.getFullYear()).slice(-2);
        const hours =
          now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
        const minutes =
          now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
        const seconds =
          now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds();
        const milliseconds = now.getMilliseconds();

        const formattedDateTime = `${day}${month}${year}${hours}${minutes}${seconds}${milliseconds}`;

        const imageInfo = {
          imageName: `ImageCapture_${formattedDateTime}.png`,
          imageType: "image/png",
          imageBase64: imageData,
        };
        setImageList((prevImageList) => [...prevImageList, imageInfo]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onChangeCheckBox = (e) => {
    console.log("checked = ", e.target.checked);
    setChecked(e.target.checked);
  };
  // useEffect(() => {
  //   window.history.pushState(null, null, window.top.location.pathname + window.top.location.search);
  //   window.addEventListener('popstate', (e) => {
  //     e.preventDefault();
  //     // Insert Your Logic Here, You Can Do Whatever You Want
  //     // setIsImgFullScreen(false)
  //   });
  // }, []);

  // window.onpopstate = function () {
  //   setIsImgFullScreen(false);
  // };

  // useEffect(() => {
  //   console.log(videoRef.current);
  // }, [videoRef]);
  // const closeImage = useCallback(() => {
  //   setIsImgFullScreen(false);
  // }, [setIsImgFullScreen]);

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
    setTimeout(() => {
      document.activeElement.blur();
    }, 600);
  });
  const handleDeleteImages = () => {
    showModalDelete();
  };
  const editImage = () => {
    setCheckImg(false);
  };
  // const handleFullScreen = () => {
  //   setIsImgFullScreen(true);
  // };

  // const handleScroll = (event) => {
  //   event.preventDefault();
  //   const delta = event.deltaY || event.detail || event.wheelDelta;

  //   // Tính toán zoom level dựa trên hướng cuộn (lên hay xuống)
  //   const newZoomLevel = delta > 0 ? zoomLevel - 0.1 : zoomLevel + 0.1;

  //   // Giới hạn giá trị zoom trong khoảng từ 0.5 đến 2.0 (có thể điều chỉnh)
  //   const clampedZoomLevel = Math.min(Math.max(newZoomLevel, 1.0), 3.0);
  //   console.log(clampedZoomLevel);
  //   setZoomLevel(clampedZoomLevel);

  //   if (videoRef.current) {
  //     videoRef.current.style.transform = `scale(${clampedZoomLevel})`;
  //   }
  // };

  // const [initialDistance, setInitialDistance] = useState(null);
  // const [zoomLevel, setZoomLevel] = useState(1.0);

  // const handleTouchStart = (event) => {
  //   const touches = event.touches;

  //   if (touches.length === 2) {
  //     const distance = Math.hypot(
  //       touches[1].clientX - touches[0].clientX,
  //       touches[1].clientY - touches[0].clientY
  //     );
  //     setInitialDistance(distance);
  //   }
  // };

  // const handleTouchMove = (event) => {
  //   const touches = event.touches;

  //   if (touches.length === 2 && initialDistance) {
  //     const distance = Math.hypot(
  //       touches[1].clientX - touches[0].clientX,
  //       touches[1].clientY - touches[0].clientY
  //     );

  //     const zoomIncrement = 0.15; // Có thể điều chỉnh tốc độ zoom
  //     const zoomChange = (distance - initialDistance) * zoomIncrement;

  //     const newZoomLevel = zoomLevel + zoomChange;

  //     // Giới hạn giá trị zoom trong khoảng từ 0.5 đến 2.0 (có thể điều chỉnh)
  //     const clampedZoomLevel = Math.min(Math.max(newZoomLevel, 1), 5.0);

  //     setZoomLevel(clampedZoomLevel);

  //     if (videoRef.current) {
  //       videoRef.current.style.transform = `scale(${clampedZoomLevel})`;
  //     }
  //   }
  // };

  // const handleTouchEnd = () => {
  //   setInitialDistance(null);
  // };
  const onChangeViewImage = () => {
    setCheckViewImg(true);
  };
  const onChangeOffViewImage = () => {
    setCheckViewImg(false);
  };

  const handleFullScreen = () => {
    setIsImgFullScreen(true);
  };
  const multiUploadImage = async () => {
    console.log(imageList);

    const prioriti = checked ? "1" : "0";
    const FormData = require("form-data");
    let data = new FormData();
    data.append("prioriti", prioriti);
    data.append("id_user", userInfo.user_id);
    data.append("type_upload", "2");
    data.append("pumb_model", "LK");
    imageList.map((image) => {
      const nameFile = image.imageName;
      const typeFile = image.imageType;
      const getFileBase64 = image.imageBase64;

      const byteCharacters = atob(getFileBase64.split(",")[1]);

      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      const buffer = byteArray.buffer;

      const blob = new Blob([buffer], { type: typeFile });

      const getFile = new File([blob], nameFile, { type: typeFile });
      console.log(getFile);
      data.append("file_upload", getFile);
    });
    axios
      .post(`${localhost}upload_file`, data)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setImageList([]);
        setIsModalImageVisible(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div style={{ position: "relative", maxHeight: "100svh", width: "70%",margin:'auto' }}>
        <>
          <Row
            style={{ position: "relative", width: "100%", height: "100svh",top:0 }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              // onWheel={handleScroll}
              // onTouchStart={handleTouchStart}
              // onTouchMove={handleTouchMove}
              // onTouchEnd={handleTouchEnd}
              style={{
                //transform:facingMode === "user" ? `scale(${zoomLevel})` : "none",
                transform: facingMode === "user" ? "scaleX(-1)" : "none",
              }}
            ></video>
          </Row>
          <Row
            style={{
              height: "20svh",
              position: "absolute",
              bottom: 0,
              zIndex: 10,
              background: "#0000001c",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Col
              span={8}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
              {imageList.length > 0 ? (
                <img
                  onClick={showModal}
                  src={imageList[imageList.length - 1].imageBase64}
                  style={{ width: 50, height: 50, borderRadius: "50%" }}
                  alt="Captured"
                />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faImage}
                    style={{ fontSize: 40, color: "#fff" }}
                  />
                </>
              )}

              {/*{imgSrc ? (
                <img
                   onClick={showModal}
                   src={imgSrc}
                   style={{ width: 50, height: 50, borderRadius: "50%" }}
                   alt="Captured"
                 />
               ) : (
                 <>
                  <FontAwesomeIcon
                     icon={faImage}
                     style={{ fontSize: 40, color: "#fff" }}
                   />
                 </>
               )} */}
            </Col>
            <Col
              span={8}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                disabled={disabledApp}
                className="btn-capture"
                onClick={captureImage}
              />
            </Col>
            <Col
              span={8}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SyncOutlined
                className="btn-switch-camera"
                disabled={disabledApp}
                onClick={switchCamera}
                style={{ fontSize: "40px", color: "#fff", cursor: "unset" }}
              />
            </Col>
          </Row>
          <Modal
            width="100%"
            className="ModalViewImage"
            open={isModalImageVisible}
            closable={false}
            footer={null}
            style={{
              top: "60px",
              width: "100%",
              maxWidth: "100%",
            }}
          >
            <div className="HeaderModal">
              <button className="buttonCloseModalView" onClick={handleCancel}>
                <img src={iconClose} />
              </button>
              {countCheckedImages() > 0 ? (
                <>
                  <span className="spanTitleHeader">
                    Đã chọn {countCheckedImages()} ảnh
                  </span>
                  <span className="spanTitleChoose">Hủy</span>
                </>
              ) : (
                <>
                  <span className="spanTitleHeader">Ảnh đã chụp</span>
                  <span className="spanTitleChoose">Chọn</span>
                </>
              )}
              {/* <span className="spanTitleHeader">
            {countCheckedImages() > 0 ? (
              <span>Đã chọn {countCheckedImages()} ảnh</span>
            ) : (
              <span>Ảnh đã chụp</span>
            )}
          </span>
          <span>Chọn</span> */}
            </div>
            <div
              className="imageGallery"
              style={{ overflowY: "auto", maxHeight: "calc(70svh - 20svh)" }}
            >
              {imageList.map((image) => (
                <div key={image.imageName} className="image-item">
                  <button
                    onClick={() => onClickCheckImage(image.imageName)}
                    style={{ backgroundColor: "white", border: "none" }}
                  >
                    <img
                      className="imageSourceGalley"
                      src={image.imageBase64}
                      alt={image.imageName}
                    />
                  </button>
                  {image.imageCheck ? (
                    <div className="inputRadio">
                      <input
                        onClick={() => onClickCheckImage(image.imageName)}
                        checked={image.imageCheck}
                        alt={image.imageName}
                        type="radio"
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="FooterDeleteImage">
              {isPrioritize ? (
                <button className="buttonDeleteImage">
                  <span className="textButtonDelete">
                    Tệp ảnh này đã được ưu tiên
                  </span>
                </button>
              ) : countCheckedImages() > 0 ? (
                <>
                  <button
                    onClick={handleDeleteImages}
                    className="buttonDeleteImage"
                  >
                    <span className="textButtonDelete">
                      Xóa {countCheckedImages()} ảnh
                    </span>
                  </button>
                  <Modal
                    className="ModalDeleteImages"
                    open={isModalDeleteImage}
                    closable={false}
                    footer={null}
                    width={"65%"}
                    style={{
                      top: "35%",
                      padding: " 10px",
                      borderRadius: " 8px",
                      gap: "8px",
                    }}
                  >
                    <div className="TitleDeleteImage">
                      <span>Bạn có chắc chắn muốn xóa ảnh này không ?</span>
                    </div>
                    <div className="ButtonDeleteModal">
                      <button
                        className="ButtonDeleteAll"
                        onClick={handleDeleteImagesOk}
                      >
                        Có
                      </button>
                      <button
                        className="ButtonDeleteAll"
                        onClick={handleDeleteCancel}
                      >
                        Không
                      </button>
                    </div>
                  </Modal>
                </>
              ) : null}
            </div>
            <div className="footerModal">
              <div className="divUploadBtn">
                <button className="uploadButton" onClick={multiUploadImage}>
                  <img src={iconUpload} />
                </button>
                <span>Upload Toàn bộ</span>
              </div>
              <div className="divCheckbox">
                <button onClick={buttonPrioritize} className="checkBoxButton">
                  <img src={iconImportant} />
                </button>
                <span>Ưu tiên</span>
              </div>

              {/* <input className="checkBoxButton" type="checkbox" /> */}
            </div>
          </Modal>
        </>
      </div>
    </>
  );
};

export default MobileWebCam;
