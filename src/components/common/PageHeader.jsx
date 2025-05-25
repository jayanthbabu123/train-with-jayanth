import React from 'react';
import { Typography, Button, Space, Breadcrumb, Row, Col } from 'antd';
import { useWindowSize } from '../../hooks/useWindowSize';

const { Title, Text } = Typography;

/**
 * Responsive page header component with support for title, subtitle, breadcrumbs, and action buttons
 * 
 * @param {Object} props
 * @param {string} props.title - The main title text
 * @param {string} props.subtitle - Optional subtitle text
 * @param {React.ReactNode[]} props.breadcrumbs - Array of breadcrumb items
 * @param {React.ReactNode} props.extra - Optional action buttons or components to display on the right
 * @param {string} props.titleColor - Optional color for the title (defaults to brand color)
 */
const PageHeader = ({ 
  title, 
  subtitle, 
  breadcrumbs, 
  extra, 
  titleColor = '#0067b8' 
}) => {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isVerySmall = width < 480;

  return (
    <>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb 
          style={{ 
            marginBottom: 16,
            whiteSpace: isVerySmall ? 'normal' : 'nowrap',
            textAlign: isMobile ? 'center' : 'left',
            wordBreak: isVerySmall ? 'break-word' : 'normal'
          }}
        >
          {breadcrumbs.map((item, index) => (
            <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}
      
      <Row 
        gutter={[16, isVerySmall ? 8 : 16]} 
        style={{ marginBottom: 24 }}
        align="middle"
        justify={isMobile ? "center" : "space-between"}
        wrap={true}
      >
        <Col xs={24} sm={24} md={extra ? 12 : 24} style={{ 
          textAlign: isMobile ? 'center' : 'left',
          padding: isVerySmall ? '0 8px' : undefined
        }}>
          <Title 
            level={isVerySmall ? 3 : 2} 
            style={{ 
              margin: 0, 
              color: titleColor,
              wordBreak: 'break-word',
              fontSize: isVerySmall ? '1.2rem' : (isMobile ? '1.5rem' : undefined)
            }}
          >
            {title}
          </Title>
          {subtitle && (
            <Text 
              type="secondary"
              style={{
                fontSize: isVerySmall ? '0.9rem' : undefined,
                display: 'block',
                marginTop: isVerySmall ? 4 : 8
              }}
            >
              {subtitle}
            </Text>
          )}
        </Col>
        
        {extra && (
          <Col xs={24} sm={24} md={12} style={{ 
            display: 'flex', 
            justifyContent: isMobile ? 'center' : 'flex-end',
            marginTop: isMobile ? (isVerySmall ? 12 : 8) : 0,
            flexWrap: 'wrap'
          }}>
            <Space 
              size={isVerySmall ? 'small' : 'middle'} 
              wrap={true}
              style={{ 
                justifyContent: 'center',
                rowGap: isVerySmall ? 8 : 12
              }}
            >
              {extra}
            </Space>
          </Col>
        )}
      </Row>
    </>
  );
};

export default PageHeader;