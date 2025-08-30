import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Typography,
  Select,
  Divider,
  message,
  Alert,
  Row,
  Col,
} from "antd";
import {
  SendOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  BookOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ContactModal = ({ isOpen, onClose, courseInfo }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Add to Firestore 'inquiries' collection
      await addDoc(collection(db, "inquiries"), {
        ...values,
        courseId: courseInfo?.id || null,
        courseTitle: courseInfo?.title || null,
        status: "new",
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      message.success("Your inquiry has been submitted successfully!");

      // Reset form after 5 seconds
      setTimeout(() => {
        form.resetFields();
        setSubmitted(false);
        onClose();
      }, 5000);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      message.error(
        "There was an error submitting your inquiry. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSubmitted(false);
    onClose();
  };

  // CSS styles for the modal
  const modalStyles = `
    .contact-modal .ant-modal-content {
      border-radius: 12px;
      overflow: hidden;
    }

    .contact-modal .ant-modal-header {
      padding: 20px 24px;
      background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
      border-bottom: none;
    }

    .contact-modal .ant-modal-title {
      color: white !important;
    }

    .contact-modal .ant-modal-close {
      color: rgba(255, 255, 255, 0.8);
    }

    .contact-modal .ant-modal-close:hover {
      color: white;
    }

    .contact-modal .ant-modal-body {
      padding: 24px;
    }

    .success-message {
      padding: 30px 0;
      text-align: center;
    }

    .input-icon-prefix {
      color: #1890ff;
    }

    .form-header {
      margin-bottom: 24px;
      text-align: center;
    }

    .form-subheader {
      color: #595959;
      margin-bottom: 24px;
    }

    .d-flex {
      display: flex;
    }

    .justify-content-end {
      justify-content: flex-end;
    }

    .gap-2 {
      gap: 0.5rem;
    }

    .pt-3 {
      padding-top: 1rem;
    }

    .mb-4 {
      margin-bottom: 1rem;
    }

    .mt-3 {
      margin-top: 0.75rem;
    }

    .text-center {
      text-align: center;
    }

    .my-4 {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    .m-0 {
      margin: 0;
    }
  `;

  return (
    <>
      <style>{modalStyles}</style>
      <Modal
        title={
          <Title level={4} className="m-0" style={{ color: "white" }}>
            {submitted ? "Thank You!" : "Contact Us"}
          </Title>
        }
        open={isOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnClose
        className="contact-modal"
      >
        {submitted ? (
          <div className="success-message">
            <div className="text-center my-4">
              <div
                style={{
                  background: "#f6ffed",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 20px",
                }}
              >
                <CheckCircleOutlined
                  style={{ fontSize: 64, color: "#52c41a" }}
                />
              </div>
              <Title level={4} className="mt-3">
                Thank you for reaching out!
              </Title>
              <Row justify="center">
                <Col xs={24} sm={18}>
                  <Text>
                    We've received your message and will get back to you
                    shortly. A member of our team will contact you within 24
                    hours.
                  </Text>
                </Col>
              </Row>
            </div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
            initialValues={{
              interest: courseInfo?.title || undefined,
            }}
          >
            <div className="form-header">
              <BookOutlined
                style={{ fontSize: 28, color: "#1890ff", marginBottom: 12 }}
              />
              <Title level={4}>We're excited to hear from you!</Title>
              <Text className="form-subheader">
                Fill out the form below and we'll get back to you as soon as
                possible.
              </Text>
            </div>

            <Alert
              type="info"
              message="Your information will be kept confidential and only used to respond to your inquiry."
              className="mb-4"
              showIcon
            />

            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input
                prefix={<UserOutlined className="input-icon-prefix" />}
                placeholder="Enter your full name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Please enter your email" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="input-icon-prefix" />}
                placeholder="Enter your email address"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="input-icon-prefix" />}
                placeholder="Enter your phone number"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="interest"
              label="Interested In"
              rules={[
                {
                  required: true,
                  message: "Please select your area of interest",
                },
              ]}
            >
              <Select
                placeholder="Select your area of interest"
                size="large"
                suffixIcon={<BookOutlined className="input-icon-prefix" />}
              >
                <Option value="HTML & HTML5">HTML & HTML5</Option>
                <Option value="CSS & Styling">CSS & Styling</Option>
                <Option value="JavaScript">JavaScript</Option>
                <Option value="React.js">React.js</Option>
                <Option value="Node.js">Node.js</Option>
                <Option value="MongoDB">MongoDB</Option>
                <Option value="Web Development Complete Course">
                  Web Development Complete Course
                </Option>
                <Option value="Real-time Project">Real-time Project</Option>
                <Option value="Mock Interviews">Mock Interviews</Option>
                <Option value="Interview Assistance">
                  Interview Assistance
                </Option>
                <Option value="Full Stack Development">
                  Full Stack Development
                </Option>
                <Option value="Python">Python</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: "Please enter your message" }]}
            >
              <TextArea
                placeholder="Tell us about your learning goals, questions, or schedule preferences"
                rows={4}
              />
              <div
                style={{ color: "#8c8c8c", fontSize: "12px", marginTop: "4px" }}
              >
                <CalendarOutlined style={{ marginRight: "5px" }} />
                Let us know your availability for training sessions if
                applicable
              </div>
            </Form.Item>

            <Divider />

            <div className="d-flex justify-content-end gap-2">
              <Button
                onClick={handleCancel}
                size="large"
                style={{ borderRadius: "6px" }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SendOutlined />}
                size="large"
                style={{
                  borderRadius: "6px",
                  background: "linear-gradient(to right, #1890ff, #096dd9)",
                  border: "none",
                }}
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default ContactModal;
