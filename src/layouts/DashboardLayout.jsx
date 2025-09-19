import React, { useState, useEffect } from "react";
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
  CloseOutlined,
} from "@ant-design/icons";
import { FaGraduationCap } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

// --- (Constants and Navigation arrays are unchanged) ---
const BRAND_COLOR = "#0067b8";
const SECONDARY_COLOR = "#1e3a8a";
const HOVER_COLOR = "#f0f7ff";

const trainerNavigation = [
  { name: "Dashboard", href: "/trainer/dashboard", icon: <HomeOutlined /> },
  { name: "Courses", href: "/trainer/courses", icon: <ReadOutlined /> },
  { name: "Materials", href: "/trainer/materials", icon: <FileTextOutlined /> },
  { name: "Assignments", href: "/trainer/assignments", icon: <FileDoneOutlined /> },
  { name: "Quizzes", href: "/trainer/quizzes", icon: <FileTextOutlined /> },
  { name: "Feed", href: "/trainer/feed", icon: <ReadOutlined /> },
  { name: "Students", href: "/trainer/students", icon: <UsergroupAddOutlined /> },
  { name: "Enrollments", href: "/trainer/enrollments", icon: <CheckCircleOutlined /> },
  { name: "Submissions", href: "/trainer/submissions", icon: <CheckCircleOutlined /> },
  { name: "Video Upload", href: "/trainer/video-upload", icon: <VideoCameraOutlined /> },
];

const studentNavigation = [
  { name: "Dashboard", href: "/student/dashboard", icon: <HomeOutlined /> },
  { name: "Courses", href: "/student/courses", icon: <BookOutlined /> },
  { name: "Assignments", href: "/student/assignments", icon: <FileDoneOutlined /> },
  { name: "Quizzes", href: "/student/quizzes", icon: <FileTextOutlined /> },
  { name: "Videos", href: "/student/videos", icon: <VideoCameraOutlined /> },
  { name: "Profile", href: "/student/profile", icon: <UserOutlined /> },
];

const Logo = ({ collapsed, isMobile = false }) => (
  <Link to="/" style={{ textDecoration: 'none' }}>
    <div
      className="d-flex align-items-center gap-2 py-4 px-3 justify-content-center"
      style={{ 
        whiteSpace: "nowrap", 
        overflow: "hidden",
        borderBottom: "1px solid #f0f0f0",
        marginBottom: "8px",
        cursor: "pointer"
      }}
    >
      <div
        style={{
          width: isMobile ? 36 : 42,
          height: isMobile ? 36 : 42,
          background: "linear-gradient(135deg, #0067b8 0%, #1e3a8a 100%)",
          borderRadius: isMobile ? 10 : 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          color: "#fff",
          fontSize: isMobile ? 20 : 24,
          marginRight: collapsed ? 0 : 12,
          boxShadow: "0 4px 12px rgba(0, 103, 184, 0.2)",
          transition: "all 0.3s ease"
        }}
      >
        <FaGraduationCap style={{ fontSize: isMobile ? 24 : 28 }} />
      </div>
      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className={`${isMobile ? 'fs-6' : 'fs-5'} fw-bold`} style={{ 
            color: BRAND_COLOR, 
            marginRight: 4,
            letterSpacing: "0.5px"
          }}>
            TrainWith
          </span>
          <span className={`${isMobile ? 'fs-6' : 'fs-5'} fw-bold`} style={{ 
            color: SECONDARY_COLOR,
            letterSpacing: "0.5px"
          }}>
            Jayanth
          </span>
        </div>
      )}
    </div>
  </Link>
);

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- *** THE MAIN FIX STARTS HERE *** ---
  const isStudent = currentUser?.role === 'student';

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigation = isStudent ? studentNavigation : trainerNavigation;
  const selectedKey = navigation.find(item => location.pathname.startsWith(item.href))?.href;

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to={isStudent ? "/student/profile" : "/trainer/profile"} style={{ textDecoration: "none" }}>
          Your Profile
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => { logout(); navigate("/login"); }} danger>
        Sign out
      </Menu.Item>
    </Menu>
  );

  const renderMenuItems = () => 
    navigation.map((item) => ({
      key: item.href,
      icon: React.cloneElement(item.icon, { 
        style: { 
          color: location.pathname.startsWith(item.href) ? BRAND_COLOR : "#666",
          fontSize: "18px"
        } 
      }),
      label: (
        <Link to={item.href} style={{ 
          textDecoration: "none",
          color: location.pathname.startsWith(item.href) ? BRAND_COLOR : "#333",
          fontWeight: location.pathname.startsWith(item.href) ? 600 : 500
        }}>
          {item.name}
        </Link>
      ),
      style: {
        margin: "4px 0",
        borderRadius: "8px",
        height: "48px",
        lineHeight: "48px",
        backgroundColor: location.pathname.startsWith(item.href) ? HOVER_COLOR : "transparent"
      }
    }));
  
  const sidebarContent = (
    <>
      <Logo collapsed={isStudent ? true : collapsed} />
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{ borderRight: 0, fontWeight: 500, fontSize: 15, padding: "8px" }}
        items={renderMenuItems()}
      />
    </>
  );
  
  const siderCollapsedState = isStudent ? true : collapsed;
  const mainContentMarginLeft = windowWidth >= 992 ? (siderCollapsedState ? 80 : 280) : 0;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* --- SIDEBAR LOGIC IS NOW FIXED --- */}
      <Sider
        breakpoint="lg"
        collapsedWidth="80"
        collapsible={!isStudent} // Only trainers can collapse
        collapsed={siderCollapsedState} // Students are always collapsed
        onCollapse={isStudent ? null : setCollapsed} // Students can't trigger collapse
        width="280"
        className="d-none d-lg-block"
        style={{
          background: "#fff",
          boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
          position: "fixed",
          height: "100vh",
          zIndex: 1000,
          left: 0
        }}
      >
        {sidebarContent}
      </Sider>

      <Drawer
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ padding: 0 }}
        width={280}
        className="d-lg-none"
        closeIcon={null}
      >
        <Logo collapsed={false} />
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ borderRight: 0, fontWeight: 500, fontSize: 15, padding: "8px" }}
          items={renderMenuItems()}
          onClick={() => setDrawerVisible(false)} // Close drawer on item click
        />
      </Drawer>

      <Layout style={{ marginLeft: mainContentMarginLeft, transition: "all 0.2s" }}>
        {/* --- HEADER LOGIC IS NOW FIXED --- */}
        <Header
          className="d-flex align-items-center justify-content-between px-4"
          style={{
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            height: 70,
            position: "sticky",
            top: 0,
            zIndex: 999,
          }}
        >
          <div className="d-flex align-items-center gap-3">
            {/* --- HAMBURGER BUTTON IS NOW HIDDEN FOR STUDENTS --- */}
            {!isStudent && (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed((prev) => !prev)}
                className="d-none d-lg-inline-flex"
                style={{ fontSize: 20, color: BRAND_COLOR, width: 40, height: 40, borderRadius: "8px" }}
              />
            )}
            <Button
              type="text"
              icon={<MenuUnfoldOutlined />}
              onClick={() => setDrawerVisible(true)}
              className="d-lg-none"
              style={{ fontSize: 20, color: BRAND_COLOR, width: 40, height: 40, borderRadius: "8px" }}
            />
          </div>
          <div className="d-flex align-items-center gap-3">
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: 20, color: BRAND_COLOR }} />}
              style={{ width: 40, height: 40, borderRadius: "8px" }}
            />
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <div className="d-flex align-items-center" style={{ cursor: "pointer", padding: "4px 12px", borderRadius: "8px" }}>
                <Avatar style={{ background: "linear-gradient(135deg, #0067b8 0%, #1e3a8a 100%)", marginRight: 8 }}>
                  {currentUser?.displayName?.charAt(0) || "U"}
                </Avatar>
                <span className="fw-semibold d-none d-lg-inline" style={{ color: BRAND_COLOR }}>
                  {currentUser?.displayName}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ 
          background: "#f8f9fa", 
          padding: windowWidth >= 768 ? "24px" : "12px",
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
