import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, Drawer } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  TeamOutlined,
  FileTextOutlined,
  FileDoneOutlined,
  BookOutlined,
  CodeOutlined,
  UserSwitchOutlined,
  VideoCameraOutlined,
  UsergroupAddOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const BRAND_COLOR = "#0067b8";
const SECONDARY_COLOR = "#1e3a8a";
const HOVER_COLOR = "#f0f7ff";

const trainerNavigation = [
  { name: "Dashboard", href: "/trainer/dashboard", icon: <HomeOutlined /> },
  { name: "Courses", href: "/trainer/courses", icon: <ReadOutlined /> },
  // { name: "Batches", href: "/trainer/batches", icon: <TeamOutlined /> },
  { name: "Materials", href: "/trainer/materials", icon: <FileTextOutlined /> },
  { name: "Assignments", href: "/trainer/assignments", icon: <FileDoneOutlined /> },
  { name: "Students", href: "/trainer/students", icon: <UsergroupAddOutlined /> },
  { name: "Enrollments", href: "/trainer/enrollments", icon: <CheckCircleOutlined /> },
  { name: "Submissions", href: "/trainer/submissions", icon: <CheckCircleOutlined /> },
  { name: "Video Upload", href: "/trainer/video-upload", icon: <VideoCameraOutlined /> },
];

const studentNavigation = [
  { name: "Dashboard", href: "/student/dashboard", icon: <HomeOutlined /> },
  { name: "Courses", href: "/student/courses", icon: <BookOutlined /> },
  { name: "Assignments", href: "/student/assignments", icon: <FileDoneOutlined /> },
  // { name: "Practice", href: "/student/practice/1", icon: <CodeOutlined /> },
  // { name: "Batches", href: "/student/batches", icon: <TeamOutlined /> },
  { name: "Videos", href: "/student/videos", icon: <VideoCameraOutlined /> },
  { name: "Profile", href: "/student/profile", icon: <UserOutlined /> },
];

const Logo = ({ collapsed }) => (
  <div
    className="d-flex align-items-center gap-2 py-4 px-3 justify-content-center"
    style={{ 
      whiteSpace: "nowrap", 
      overflow: "hidden",
      borderBottom: "1px solid #f0f0f0",
      marginBottom: "8px"
    }}
  >
    <div
      style={{
        width: 42,
        height: 42,
        background: "linear-gradient(135deg, #0067b8 0%, #1e3a8a 100%)",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        color: "#fff",
        fontSize: 24,
        marginRight: collapsed ? 0 : 12,
        boxShadow: "0 4px 12px rgba(0, 103, 184, 0.2)",
        transition: "all 0.3s ease"
      }}
    >
      TJ
    </div>
    {!collapsed && (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="fs-5 fw-bold" style={{ 
          color: BRAND_COLOR, 
          marginRight: 4,
          letterSpacing: "0.5px"
        }}>
          TrainWith
        </span>
        <span className="fs-5 fw-bold" style={{ 
          color: SECONDARY_COLOR,
          letterSpacing: "0.5px"
        }}>
          Jayanth
        </span>
      </div>
    )}
  </div>
);

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation =
    currentUser?.role === "trainer" ? trainerNavigation : studentNavigation;

  const selectedKey = navigation.find(
    (item) => location.pathname.indexOf(item.href) === 0
  )?.href;

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link
          to={
            currentUser?.role === "trainer"
              ? "/trainer/profile"
              : "/student/profile"
          }
          style={{ textDecoration: "none" }}
        >
          Your Profile
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={async () => {
          await logout();
          navigate("/login");
        }}
        danger
      >
        Sign out
      </Menu.Item>
    </Menu>
  );

  // Sidebar content (for both Sider and Drawer)
  const sidebarContent = (
    <>
      <Logo collapsed={collapsed} />
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{ 
          borderRight: 0, 
          fontWeight: 500, 
          fontSize: 15,
          padding: "8px"
        }}
        items={navigation.map((item) => ({
          key: item.href,
          icon: React.cloneElement(item.icon, { 
            style: { 
              color: location.pathname.indexOf(item.href) === 0 ? BRAND_COLOR : "#666",
              fontSize: "18px"
            } 
          }),
          label: (
            <Link 
              to={item.href} 
              style={{ 
                textDecoration: "none",
                color: location.pathname.indexOf(item.href) === 0 ? BRAND_COLOR : "#333",
                fontWeight: location.pathname.indexOf(item.href) === 0 ? 600 : 500
              }}
            >
              {item.name}
            </Link>
          ),
          style: {
            margin: "4px 0",
            borderRadius: "8px",
            height: "48px",
            lineHeight: "48px",
            backgroundColor: location.pathname.indexOf(item.href) === 0 ? HOVER_COLOR : "transparent"
          }
        }))}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar for desktop */}
      <Sider
        breakpoint="lg"
        collapsedWidth={80}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={280}
        className="d-none d-lg-block"
        style={{
          background: "#fff",
          boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
          position: "fixed",
          height: "100vh",
          zIndex: 1000
        }}
      >
        {sidebarContent}
      </Sider>

      {/* Drawer for mobile */}
      <Drawer
        title={<Logo collapsed={false} />}
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ padding: 0 }}
        width={280}
        className="d-lg-none"
      >
        {sidebarContent}
      </Drawer>

      <Layout style={{ marginLeft: collapsed ? 80 : 280, transition: "all 0.2s" }}>
        {/* Header */}
        <Header
          className="d-flex align-items-center justify-content-between px-4"
          style={{
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            height: 70,
            padding: 0,
            position: "sticky",
            top: 0,
            zIndex: 999,
            width: "100%"
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((prev) => !prev)}
              className="d-none d-lg-inline-flex"
              style={{ 
                fontSize: 20, 
                color: BRAND_COLOR,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                transition: "all 0.3s"
              }}
            />
            <Button
              type="text"
              icon={<MenuUnfoldOutlined />}
              onClick={() => setDrawerVisible(true)}
              className="d-lg-none"
              style={{ 
                fontSize: 20, 
                color: BRAND_COLOR,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px"
              }}
            />
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-lg-flex align-items-center" style={{ marginRight: 16 }}>
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  style={{
                    color: location.pathname.indexOf(item.href) === 0 ? BRAND_COLOR : "#333",
                    fontWeight: location.pathname.indexOf(item.href) === 0 ? 600 : 500,
                    fontSize: 15,
                    marginLeft: 24,
                    textDecoration: "none",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    transition: "all 0.3s",
                    backgroundColor: location.pathname.indexOf(item.href) === 0 ? HOVER_COLOR : "transparent"
                  }}
                  className="header-link"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: 20, color: BRAND_COLOR }} />}
              className="me-2"
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                transition: "all 0.3s"
              }}
            />
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <div 
                className="d-flex align-items-center" 
                style={{ 
                  cursor: "pointer",
                  padding: "4px 12px",
                  borderRadius: "8px",
                  transition: "all 0.3s",
                  backgroundColor: HOVER_COLOR
                }}
              >
                <Avatar
                  style={{
                    background: "linear-gradient(135deg, #0067b8 0%, #1e3a8a 100%)",
                    marginRight: 8,
                    boxShadow: "0 2px 8px rgba(0, 103, 184, 0.2)"
                  }}
                  size={36}
                >
                  {currentUser?.displayName?.charAt(0) || "U"}
                </Avatar>
                <span className="fw-semibold d-none d-lg-inline" style={{ color: BRAND_COLOR }}>
                  {currentUser?.displayName}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>
        {/* Main content */}
        <Content style={{ 
          margin: 0, 
          background: "#f8f9fa", 
          minHeight: "calc(100vh - 70px)",
          padding: "24px",
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden"
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
} 