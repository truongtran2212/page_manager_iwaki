import React, { useEffect, useState } from "react";
import "./formSelect2.css";
import logoIwaki from "../../Images/LogoIwaki.svg";
import BackgroundIconVector from "../../Images/BackgroundIconVector.svg";
import { useSelector } from "react-redux";
import axios from "axios";
import { Modal, Row, Upload, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

import { ModalViewImage } from "./modalUpload/Mobile/ModalImage";
import { localhost } from "../../server";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

import iconUpload from "../../Images/uploadPhotosLinear.svg";
import iconUploadActive from "../../Images/uploadPhotosLinearHover.svg";
import iconImportant from "../../Images/prioritizeLinear.svg";
import iconImportantActive from "../../Images/prioritizeBoad.svg";
import iconClose from "../../Images/iconClose.svg";
import iconSuccess from "../../Images/iconComplete.svg";
const MySwal = withReactContent(Swal);


export default function FormSelect2() {
  const [isModalImageVisible, setIsModalImageVisible] = useState(false);
  const [isModalDeleteImage, setIsModalDeleteImage] = useState(false);
  const [isPrioritize, setIsPrioritize] = useState(false);
  const [isOpenModalManage, setIsOpenModalManage] = useState(false)
  const [imageList, setImageList] = useState([]);
  const [checked, setChecked] = useState(false);
  const [options, setOptions] = useState(["LK"]);
  const [selectedValue, setSelectedValue] = useState(null);
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user);

  const showModal = () => {
    setIsModalImageVisible(true);
  };
  const handleOk = () => {
    setIsModalImageVisible(false);
  };

  const handleCancel = () => {
    setImageList([]);
    setIsModalImageVisible(false);
    setIsPrioritize(false);
  };

  const showModalDelete = () => {
    setIsModalDeleteImage(true);
  };
  const handleDeleteOK = () => {
    setIsModalDeleteImage(false);
  };

  const handleDeleteCancel = () => {
    setIsModalDeleteImage(false);
  };
  const onClickCheckImage = (imageName) => {
    const updatedImages = imageList.map((image) =>
      image.imageName === imageName
        ? { ...image, imageCheck: !image.imageCheck }
        : { ...image }
    );
    setImageList(updatedImages);
  };

  const onClickCancelCheckImage = () => {
    const updatedImages = imageList.map((image) =>
      image.imageCheck === true ? { ...image, imageCheck: false } : { ...image }
    );
    setImageList(updatedImages);
  };
  const onClickChooseAllImage = () => {
    console.log(imageList);
    const updatedImages = imageList.map((image) =>
      image.imageCheck === false ? { ...image, imageCheck: true } : { ...image }
    );
    setImageList(updatedImages);
  };

  const countCheckedImages = () => {
    return imageList.filter((image) => image.imageCheck).length;
  };

  const handleDeleteImagesOk = () => {
    const updatedImages = imageList.filter((image) => !image.imageCheck);
    setImageList(updatedImages);
    setIsModalDeleteImage(false);
    if (imageList.length === 0) {
      setIsModalImageVisible(false);
    }
  };

  useEffect(() => {
    if (imageList.length === 0) {
      setIsModalImageVisible(false);
    }
  }, [imageList]);
  // const handleDeleteImages = () => {
  //   MySwal.fire({
  //     title: (
  //       <span
  //         style={{
  //           fontFamily: "Lato",
  //           fontSize: "14px",
  //           fontWeight: "400",
  //           lineHeight: "20px",
  //           letterSpacing: "0.20000000298023224px",
  //           textAlign: "center",
  //         }}
  //       >
  //         Bạn có chắc chắn muốn xóa ảnh này không?
  //       </span>
  //     ),
  //     showCancelButton: true,
  //     confirmButtonText: "Có",
  //     cancelButtonText: "Không",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const updatedImages = images.filter((image) => !image.imageCheck);
  //       setImages(updatedImages);
  //     }
  //     //else if (result.dismiss === MySwal.DismissReason.cancel) {

  //     // }
  //   });
  // };
  const handleDeleteImages = () => {
    showModalDelete();
  };
  const buttonPrioritize = () => {
    isPrioritize ? setIsPrioritize(false) : setIsPrioritize(true);
    // setIsPrioritize(true);
  };

  const onChangeCheckBox = (e) => {
    console.log("checked = ", e.target.checked);
    setChecked(e.target.checked);
  };
  const handleSelectChange = (value) => {
    setSelectedValue(value);
  };

  const handleDeleteImage = (imageName) => {
    // Filter out the image with the given imageName
    const updatedImageList = imageList.filter(
      (image) => image.imageName !== imageName
    );
    setImageList(updatedImageList);
  };

  const uploadProps = {
    name: "file",
    showUploadList: false,
    multiple: true,
    beforeUpload(file) {
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpg";
      const isJPEG = file.type === "image/jpeg";
      const isTIF = file.type === "image/tif";

      if (!isPNG && !isJPG && !isJPEG && !isTIF) {
        message.error(`${file.name} is not a Image file`);
      } else {
        return isPNG || isJPEG || isJPG || isTIF;
      }
    },
    onChange(info) {
      const newFile = info.file.originFileObj;
      console.log(newFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageBase64 = e.target.result;
        const imageInfo = {
          imageName: newFile.name,
          imageType: newFile.type,
          imageBase64: imageBase64,
          imageCheck: false,
        };
        setImageList((prevImageList) => [...prevImageList, imageInfo]);
      };
      reader.readAsDataURL(newFile);
    },
  };
  const customRequest = () => {
    setTimeout(() => {
      setIsModalImageVisible(true);
    }, 1000);
  };

  const [checkedTime, setCheckedTime] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);

  const multiUploadImage = async () => {
    setCheckedTime(false);
    try {
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
        data.append("file_upload", getFile);
      });
      axios
        .post(`${localhost}upload_file`, data)
        .then((response) => {
          setCheckedTime(true);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error:", error);
      // MySwal.fire({
      //   icon: "error",
      //   title: "Lỗi!",
      //   text: "Có lỗi xảy ra khi gửi dữ liệu.",
      // });
    }
  };

  useEffect(() => {
    if (checkedTime === true) {
      setCheckedTime(null);
      MySwal.fire({
        iconHtml: <img src={iconSuccess} alt="" />,
        title: "Hoàn thành !!",
        customClass: "custome-success",
        showConfirmButton: false,
        timer: 2500,
      });
      setImageList([]);
      setIsModalImageVisible(false);
      setIsUpdating(false);
      setIsPrioritize(false);
    } else if (checkedTime === false) {
      setCheckedTime(null);
      MySwal.fire({
        title: <span>Đang upload toàn bộ ảnh</span>,
        showConfirmButton: false,
        timer: 2000000,
        allowOutsideClick: false,
      });
      setIsUpdating(true);
    }
  }, [checkedTime]);

  // const multiUploadImage = async () => {
  //   console.log(selectedValue);
  //   const prioriti = checked ? "1" : "0";
  //   const FormData = require("form-data");
  //   let data = new FormData();
  //   data.append("prioriti", prioriti);
  //   data.append("id_user", userInfo.user_id);
  //   data.append("type_upload", "2");
  //   data.append("pumb_model", "LK");
  //   imageList.map((image) => {
  //     const nameFile = image.imageName;
  //     const typeFile = image.imageType;
  //     const getFileBase64 = image.imageBase64;

  //     const byteCharacters = atob(getFileBase64.split(",")[1]);

  //     const byteNumbers = new Array(byteCharacters.length);
  //     for (let i = 0; i < byteCharacters.length; i++) {
  //       byteNumbers[i] = byteCharacters.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);

  //     const buffer = byteArray.buffer;

  //     const blob = new Blob([buffer], { type: typeFile });

  //     const getFile = new File([blob], nameFile, { type: typeFile });
  //     console.log(getFile);
  //     data.append("file_upload", getFile);
  //   });
  //   axios
  //     .post(`${localhost}upload_file`, data)
  //     .then((response) => {
  //       console.log(JSON.stringify(response.data));
  //       setImageList([]);
  //       setIsModalImageVisible(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const showModalManage = () => {
    navigate("/file-manager");
    // setIsOpenModalManage(true)
  }

  return (
    <>
      <div className="FormSelect">
        <div className="logoIwaki">
          <img src={logoIwaki} alt="" />
        </div>
        <div className="button-select">
          <Link className="tagALinkSelectCapture" to="/CaptureCamera">
            <button className="btnSelectCapture">
              <p className="textCapture">Capture</p>
            </button>
          </Link>
          <Upload
            {...uploadProps}
            fileList={[]}
            listType="picture"
            accept=".png,.jpg,.jpeg,.tif"

            capture={false}
            customRequest={customRequest}
          >
            <button className="btnSelectUpload">
              <p className="textUpload">Upload File</p>
            </button>
          </Upload>
          <Modal
            className="ModalViewImage"
            open={isModalImageVisible}
            closable={false}
            footer={null}
            style={{top:'60px'}}
          >
            <div className="HeaderModal">
              <button className="buttonCloseModalView" onClick={handleCancel}>
                <img
                  style={{ width: "30px", height: "30px" }}
                  src={iconClose}
                  alt=""
                />
              </button>
              {countCheckedImages() > 0 ? (
                <>
                  <span className="spanTitleHeader">
                    Đã chọn {countCheckedImages()} ảnh
                  </span>
                  <button
                    className="spanTitleChoose"
                    onClick={onClickCancelCheckImage}
                  >
                    <span>Hủy</span>
                  </button>
                </>
              ) : (
                <>
                  <span className="spanTitleHeader">Ảnh đã chụp</span>
                  <button
                    className="spanTitleChoose"
                    onClick={onClickChooseAllImage}
                  >
                    <span>Chọn</span>
                  </button>
                </>
              )}
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
              {/* {isPrioritize ? (
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
              ) : null} */}
              {countCheckedImages() > 0 ? (
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
                  <img src={isUpdating ? iconUploadActive : iconUpload} />
                </button>
                <span>Upload Toàn bộ</span>
              </div>
              <div className="divCheckbox">
                <button onClick={buttonPrioritize} className="checkBoxButton">
                  <img
                    src={isPrioritize ? iconImportantActive : iconImportant}
                  />
                </button>
                <span>Ưu tiên</span>
              </div>
            </div>
          </Modal>
          <button className="btnSelectManager" onClick={showModalManage}>
            <p className="textFileManager" >File Manager</p>
          </button>
        </div>
        <div className="imageNenVector">
          <img src={BackgroundIconVector} alt="" />
        </div>
        {/* {isOpenModalManage === true ?
          <ModalFileManager
            open={isOpenModalManage}
            setIsOpenModalManage={setIsOpenModalManage}
          />
          : null} */}
      </div>
    </>
  );
}
