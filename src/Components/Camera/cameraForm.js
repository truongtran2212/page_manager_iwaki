import { Button } from "antd";
import React from "react";
import MobileWebCam from "./Mobile";
import WindowCamera from "./Window";
import MobileWebCam2 from "./Mobile/CameraMobile";

export default function CameraForm() {
  const isMobile = window.innerWidth <= 1024;

  // return <>{isMobile ? <MobileWebCam /> : <WindowCamera />}</>;
  return <MobileWebCam2 />;
  // return <MobileWebCam />;


}
