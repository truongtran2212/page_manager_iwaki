import React, { useEffect, useState } from 'react'
import "./ModalFileManager.css"
import { Avatar, Button, Col, DatePicker, Form, Modal, Row, Table } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import { localhost } from '../../../server'
import { Container } from '@mui/material'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import BackIcon from "./../../../Images/arrow/BackArrow.svg"
import { useNavigate } from 'react-router-dom'
import ModalDetailPackage from './ModalDetailPackage'
import SubMenuIcon from './../../../Images/SubMenuIcon.svg'
import LogoIwakiIcon from './../../../Images/LogoIwakiManger.svg'
const { RangePicker } = DatePicker;

const ModalFileManager = ({ open, setIsOpenModalManage }) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState([])
    const [dateFrom, setDateFrom] = useState()
    const [dateTo, setDateTo] = useState()
    const [isOpenDetail, setIsOpenDetail] = useState(false)
    const [dataDetail, setDataDetail] = useState()
    const [fieldFilter, setFieldFilter] = useState()
    const [openBtnFinish, setOpenBtnFinish] = useState(true)
    const [pager, setPager] = useState({
        pageSize: 10,
        count: 0,
        current: 1,
    });

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'name',
            align: "center",
            ellipsis: true,
            width: 50,
            render: (value, item, index) =>
                index + 1 + (pager.current - 1) * pager.pageSize,
        },
        {
            title: 'Pack name',
            dataIndex: 'pack_name',
            key: 'pack_name',
            width: 250,
            align: "center",
        },
        {
            title: 'Nguồn upload',
            dataIndex: 'pack_upload_type',
            key: 'pack_upload_type',
            width: 150,
            align: "center",
            render: (text) => text === 1 ? "Take a photo" : "Upload file"
        },
        {
            title: 'Pack upload date',
            dataIndex: 'pack_upload_date',
            key: 'pack_upload_date',
            width: 150,
            align: "center",
            render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm:ss")
        },
        {
            title: 'Thao tác',
            dataIndex: 'pack_upload_date',
            key: 'pack_upload_date',
            align: "center",
            width: 100,
            render: (text, record, index) => <Button onClick={() => showDetail(record)}>Detail</Button>
        },
    ];

    const showDetail = (record) => {
        setDataDetail(record)
        setIsOpenDetail(true)
    }

    const fetchListData = (params) => {
        const FormData = require('form-data');
        let data = new FormData();
        console.log(params)
        data.append('id_user', params.id_user);
        data.append('date_from', params.date_from);
        data.append('date_to', params.date_to);
        data.append('page_index', params.page_index);
        data.append('page_size', params.page_size);

        axios.post(`${localhost}list_file`, data).then(res => {
            setPager({
                current: params.page_index,
                pageSize: params.page_size,
                count: res.data.total_count,
            });
            setDataSource(res.data.list_file)
            setFieldFilter({
                date_from: params.date_from,
                date_to: params.date_to
            })
            setDateFrom(params.date_from)
            setDateTo(params.date_to)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        form.setFieldsValue({
            date_from: dayjs(),
            date_to: dayjs().add(7, 'day')
        })
        const id = setInterval(() => {
            fetchListData(
                {
                    id_user: 1,
                    date_from: dayjs().format('YYYY-MM-DD'),
                    date_to: dayjs().add(7, 'day').format('YYYY-MM-DD'),
                    page_index: pager.current,
                    page_size: pager.pageSize,
                });
            clearInterval(id);
        }, 300);
        return () => clearInterval(id);
    }, []);

    const handleChange = (pagination) => {
        const currentPager = { ...pager };
        currentPager.current = pagination.current;
        currentPager.pageSize = 10;
        setPager({ ...currentPager });
        fetchListData({
            id_user: 1,
            date_from: fieldFilter.date_from,
            date_to: fieldFilter.date_to,
            page_index: pagination.current,
            page_size: pagination.pageSize,
            // search,
        });
    };

    const changeDateFrom = (value) => {
        form.setFieldValue("date_to", undefined)
        setOpenBtnFinish(false)
        setDateFrom(dayjs(value).format("YYYY-MM-DD"))
    }
    const changeDateTo = (value) => {
        if (value !== null) {
            setOpenBtnFinish(true)
        } else {
            setOpenBtnFinish(false)
        }
        setDateTo(dayjs(value).format("YYYY-MM-DD"))
    }

    const disabledDate = (current) => {
        console.log(form.getFieldValue("date_from"))
        if (form.getFieldValue("date_from") !== null || form.getFieldValue("date_from") || undefined) {
            return current && current < form.getFieldValue("date_from").endOf("day");

        }
    };

    const onFinish = (values) => {
        console.log(values)
        setFieldFilter({
            date_from: dayjs(values.date_from).format("YYYY-MM-DD"),
            date_to: dayjs(values.date_to).format("YYYY-MM-DD"),
        })
        fetchListData(
            {
                id_user: 1,
                date_from: dayjs(values.date_from).format("YYYY-MM-DD"),
                date_to: dayjs(values.date_to).format("YYYY-MM-DD"),
                page_index: pager.current,
                page_size: pager.pageSize,
            });
    }

    const backHomePage = () => {
        navigate("/")
    }

    return (
        <>
            <div style={{ height: "100svh", width: "100%", background: "#fff" }}>
                <Container>
                    <Row style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "6svh" }}>
                        <Col span={8} style={{ display: "flex", alignItems: "center", columnGap: "1ch" }}>
                            <Button style={{ padding: "4px 10px", borderRadius: 8 }}>
                                <img src={SubMenuIcon} alt=''></img>
                            </Button>
                            <img src={LogoIwakiIcon} alt=''></img>
                        </Col>
                        <Col span={8}>
                        </Col>
                        <Col span={8} style={{display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <Avatar
                                style={{
                                    backgroundColor: '#87d068',
                                }}
                                icon={<UserOutlined />}
                            />
                        </Col>
                    </Row>
                </Container>
                <Row style={{ background: "#F8FAFC", height: "1svh" }}>
                </Row>
                <Container>

                    <Row style={{ padding: "3% 0%", borderBottom: "1px solid #F1F5F9" }}>
                        <span style={{ color: "#394B76", fontWeight: "bold", fontSize: 16 }}>File Manager</span>
                    </Row>
                    <Form
                        form={form}
                        name="control-hooks"
                        layout='vertical'
                        onFinish={onFinish}
                    >
                        <Row style={{ width: "100%", paddingTop: "2.5%" }}>
                            <Col span={9}>
                                <Form.Item
                                    name="date_from"
                                    label={<span style={{ fontWeight: "bold" }}>From</span>}
                                >
                                    <DatePicker
                                        style={{ width: "100%" }}
                                        format={"DD-MM-YYYY"}
                                        onChange={changeDateFrom}
                                        allowClear={false}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={9} offset={2}>
                                <Form.Item
                                    name="date_to"
                                    label={<span style={{ fontWeight: "bold" }}>To</span>}
                                >
                                    <DatePicker
                                        allowClear={false}
                                        style={{ width: "100%" }}
                                        format={"DD-MM-YYYY"}
                                        onChange={changeDateTo}
                                        disabledDate={disabledDate}
                                        disabled={form.getFieldValue("date_from") === undefined || form.getFieldValue("date_from") === null ? true : false}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={2} offset={2}>
                                <Form.Item
                                    label=" "
                                >
                                    <Button disabled={!openBtnFinish} style={{ width: "100%" }} icon={<SearchOutlined />} htmlType='submit'></Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        columns={columns}
                        size='small'
                        dataSource={dataSource}
                        onChange={handleChange}
                        className='table-file-manage'
                        style={{ width: "100%", paddingTop: "1%" }}
                        pagination={{
                            current: pager.current,
                            pageSize: pager.pageSize,
                            total: pager.count,
                        }}
                        scroll={{
                            y: "55vh",
                            x: 600
                        }}
                    ></Table>
                </Container>

                {isOpenDetail === true ?
                    <ModalDetailPackage
                        open={isOpenDetail}
                        setIsOpenDetail={setIsOpenDetail}
                        dataDetail={dataDetail}
                    />
                    : null}
            </div>
        </>
    )
}

export default ModalFileManager