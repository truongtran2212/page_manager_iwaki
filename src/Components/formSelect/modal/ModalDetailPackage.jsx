import { Col, Modal, Row } from 'antd'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

import LoadingIcon from "./../../../Images/iconLoading.svg"
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import "./ModalFileManager.css"
import { localhost } from '../../../server';

const ModalDetailPackage = ({ open, setIsOpenDetail, dataDetail }) => {
    const [mainImageURL, setMainImageURL] = useState()
    const [thumbnailURL, setThumbnailURL] = useState([])
    const [loadingImage, setLoadingImage] = useState(false)
    const [indexImage, setIndexImage] = useState(0)

    const handleCancel = () => {
        setIsOpenDetail(false)
    }

    const convertToImage = (value) => {
        let arrData = []
        for (let i = 0; i < value.lst_thum_base64.length; i++) {
            arrData.push(`data:image/jpeg;base64,${value.lst_thum_base64[i]}`)
        }
        setThumbnailURL(arrData)
        setMainImageURL(`data:image/jpeg;base64,${value.img_base64}`)
        setLoadingImage(false)
    }

    const fetchListImage = (index) => {
        setLoadingImage(true)
        axios.post(`${localhost}file_details`, {
            pack_file_path: dataDetail.pack_list_file_path[0][index],
            pack_list_thumbnail_path: dataDetail.pack_list_file_path[0]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            convertToImage(res.data)
        }).catch(err => {
            setLoadingImage(false)
        })
    }

    useEffect(() => {
        fetchListImage(indexImage)
    }, [indexImage]);

    const changeMainImage = (index) => {
        setIndexImage(index)
    }

    return (
        <Modal className='modal-detail' open={open} width={"96%"} onCancel={handleCancel} footer={false} style={{ top: 10, height: "70vh" }}>
            <Row>
                <Col span={24}>
                    <div style={{ position: "relative", paddingTop: "7%" }} className='size-image'>
                        <TransformWrapper initialScale={1}>
                            {({ zoomIn, zoomOut, resetTransform }) => (
                                <>
                                    <TransformComponent contentStyle={{ cursor: 'zoom-in', width: "100%", display: "flex", padding: "1% 1% 2%", height: "70vh", justifyContent: "center" }}>
                                        {loadingImage === false ?
                                            <img
                                                src={mainImageURL}
                                                style={{ width: "96%", height: "70vh", filter: "drop-shadow(2px 4px 6px black)", imageRendering: "unset" }}
                                                alt="Hình ảnh"
                                            />
                                            :
                                            <img src={LoadingIcon} className='load-image' alt=''></img>
                                        }
                                    </TransformComponent>
                                </>
                            )}
                        </TransformWrapper>
                    </div>

                    <div className='thumbnail-class' >
                        {thumbnailURL.map((item, index) => (
                            <img onClick={() => changeMainImage(index)} style={{ border: index === indexImage ? "2px solid red" : null }} src={item} alt=''></img>
                        ))}
                    </div>
                </Col>
            </Row>
        </Modal>
    )
}

export default ModalDetailPackage