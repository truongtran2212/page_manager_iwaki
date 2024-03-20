// import logo from "./logo.svg";
import "./ModalImage.css";
import { Modal } from "antd";
import { useState } from "react";
import iconUpload from "../../../../Images/uploadPhotosLinear.svg";
import iconUploadHover from "../../../../Images/uploadPhotosLinearHover.svg";
import iconImportant from "../../../../Images/prioritizeLinear.svg";
import iconImportantHover from "../../../../Images/prioritizeBoad.svg";
import { OpenNotificationYesNo } from "../../../Notifi/openNotificationSweetAlert";

export function ModalImage() {
  const [isModalImageVisible, setIsModalImageVisible] = useState(false);
  const [isModalDeleteImage, setIsModalDeleteImage] = useState(false);
  const [isPrioritize, setIsPrioritize] = useState(false);
  const [imageList, setImageList] = useState([]);
  const showModal = () => {
    setIsModalImageVisible(true);
  };
  const handleOk = () => {
    setIsModalImageVisible(false);
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

  return (
    <>
      <button onClick={showModal}>OpenModal</button>
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
          <button onClick={handleCancel}>close</button>
          {countCheckedImages() > 0 ? (
            <>
              <span className="spanTitleHeader">
                Đã chọn {countCheckedImages()} ảnh
              </span>
              <span>Hủy</span>
            </>
          ) : (
            <>
              <span className="spanTitleHeader">Ảnh đã chụp</span>
              <span>Chọn</span>
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
                  src={image.imageBase}
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
            <button className="uploadButton">
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
  );
}


export function ModalViewImage(imageListt) {
  const [isModalImageVisible, setIsModalImageVisible] = useState(false);
  const [isModalDeleteImage, setIsModalDeleteImage] = useState(false);
  const [isPrioritize, setIsPrioritize] = useState(false);
  const [imageList, setImageList] = useState([imageListt]);
  const showModal = () => {
    setIsModalImageVisible(true);
  };
  const handleOk = () => {
    setIsModalImageVisible(false);
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
  const handleDeleteImages = () => {
    showModalDelete();
  };
  const buttonPrioritize = () => {
    isPrioritize ? setIsPrioritize(false) : setIsPrioritize(true);
  };

  return (
    <>
      <button onClick={showModal}>OpenModal</button>
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
          <button onClick={handleCancel}>close</button>
          {countCheckedImages() > 0 ? (
            <>
              <span className="spanTitleHeader">
                Đã chọn {countCheckedImages()} ảnh
              </span>
              <span>Hủy</span>
            </>
          ) : (
            <>
              <span className="spanTitleHeader">Ảnh đã chụp</span>
              <span>Chọn</span>
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
                  src={image.imageBase}
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
            <button className="uploadButton">
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
  );
}