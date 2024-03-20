import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login2 from "./Components/Login/Login2";
import FormSelect2 from "./Components/formSelect/formSelect2";
import CameraForm from "./Components/Camera/cameraForm";
import ModalImage from "./Components/formSelect/modalUpload/Mobile/ModalImage";
import ModalFileManager from "./Components/formSelect/modal/ModalFileManager";
import MobileWebCam2 from "./Components/Camera/Mobile/CameraMobile";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Login2 />} /> */}
          <Route path="/" element={<FormSelect2 />} />
          <Route path="/Login" element={<Login2 />} />
          <Route path="/FormSelect" element={<FormSelect2 />} />
          <Route path="/CaptureCamera" element={<CameraForm />} />
          <Route path="/file-manager" element={<ModalFileManager />} />

          {/* <Route path="/ModalImage" element={<ModalImage />} /> */}
        </Routes>
      </BrowserRouter>
      {/* <Album/> */}
    </div>
  );
}
