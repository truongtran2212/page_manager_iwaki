import React from "react";
import "./Login2.css";
import logoIwaki from "../../Images/LogoIwaki.svg";
import BackgroundIconVector from "../../Images/BackgroundIconVector.svg";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import userIcon from "../../Images/userIcon.svg";
import passwordIcon from "../../Images/passwordIcon.svg";
import Arrow from "../../Images/ArrowIconLogin.svg";
import { Link } from "react-router-dom";

export default function Login2() {
  const [form] = Form.useForm();


  return (
    <>
      <div className="FormLogin">
        <div className="logoIwaki">
          <img src={logoIwaki} />
        </div>
        <div className="LoginTitle">
          <p>Sign in to your account</p>
        </div>
        <div className="loginForm">
          <Form
            className="formLoginn"
            form={form}
            name="horizontal_login"
            layout="inline"
            // onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input prefix={<img src={userIcon} />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input
                prefix={<img src={passwordIcon} />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            {/* <Form.Item shouldUpdate>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                //   disabled={
                //     !clientReady ||
                //     !form.isFieldsTouched(true) ||
                //     !!form
                //       .getFieldsError()
                //       .filter(({ errors }) => errors.length).length
                //   }
                >
                  Log in
                </Button>
              )}
            </Form.Item> */}
          
          <Link
            className="linkForgot"
            // to="https://www.google.com"
          >
            <span className="spanForgot">Forgot your password</span>
          </Link>
          <Button className="btnSignIn" htmlType="submit">
            {/* <Link to="/formSelect"> */}
            <span style={{ margin: "auto" }}>Sign in</span>
            <img className="iconArrow" src={Arrow} alt="" />
            {/* </Link> */}
          </Button>
          </Form>
        </div>
``
        <div className="imageNenVectorLogin">
          <img src={BackgroundIconVector} />
        </div>
      </div>
    </>
  );
}
