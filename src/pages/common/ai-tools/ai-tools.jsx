import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Divider,
  Rate,
  Avatar,
  Badge,
  Tooltip,
  Statistic,
  Modal,
  List
} from 'antd';
import { 
  RocketOutlined,
  BulbOutlined,
  StarOutlined,
  LinkOutlined,
  GiftOutlined,
  CheckCircleOutlined,
  CrownOutlined,
  TeamOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  FilterOutlined,
  SearchOutlined,
  FireOutlined,
  EyeOutlined,
  HeartOutlined,
  ExperimentOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { 
  SiOpenai, 
  SiGoogle, 
  SiPerplexity, 
  SiAnthropic, 
  SiNotion,
  SiGithub,
  SiDiscord,
  SiTelegram
} from 'react-icons/si';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const AIToolsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedTool, setSelectedTool] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const aiTools = [
    {
      id: 1,
      name: "ChatGPT",
      company: "OpenAI",
      logo: <SiOpenai style={{ fontSize: '32px', color: '#10a37f' }} />,
      description: "Advanced language model for conversation, writing, and problem-solving. Powered by GPT-4 technology.",
      features: [
        "Natural language conversations",
        "Code generation & debugging",
        "Creative writing assistance",
        "Multi-language support",
        "Real-time responses"
      ],
      pricing: "Free tier available, Plus: $20/month",
      offers: [
        {
          title: "Student Discount",
          description: "50% off ChatGPT Plus for verified students",
          icon: <GiftOutlined style={{ color: '#52c41a' }} />
        },
        {
          title: "Team Plan",
          description: "Save up to 40% with annual billing",
          icon: <TeamOutlined style={{ color: '#1890ff' }} />
        }
      ],
      rating: 4.8,
      category: "Conversational AI",
      color: "#10a37f",
      website: "https://chat.openai.com",
      isPopular: true,
      views: 1250000
    },
    {
      id: 2,
      name: "Perplexity AI",
      company: "Perplexity",
      logo: <SiPerplexity style={{ fontSize: '32px', color: '#8b5cf6' }} />,
      description: "AI-powered search engine that provides accurate, real-time answers with source citations.",
      features: [
        "Real-time web search",
        "Source citations",
        "Multiple search modes",
        "File upload support",
        "Academic research tools"
      ],
      pricing: "Free tier available, Pro: $20/month",
      offers: [
        {
          title: "Airtel Partnership",
          description: "Free Perplexity Pro with Airtel postpaid plans",
          icon: <GiftOutlined style={{ color: '#52c41a' }} />
        },
        {
          title: "Student Plan",
          description: "50% off for students with .edu email",
          icon: <TeamOutlined style={{ color: '#1890ff' }} />
        }
      ],
      rating: 4.7,
      category: "Search & Research",
      color: "#8b5cf6",
      website: "https://perplexity.ai",
      views: 890000
    },
    {
      id: 3,
      name: "Gemini",
      company: "Google",
      logo: <SiGoogle style={{ fontSize: '32px', color: '#4285f4' }} />,
      description: "Google's most advanced AI model with multimodal capabilities for text, images, and code.",
      features: [
        "Multimodal understanding",
        "Advanced reasoning",
        "Code generation",
        "Image analysis",
        "Google integration"
      ],
      pricing: "Free tier available, Advanced: $20/month",
      offers: [
        {
          title: "Google One Integration",
          description: "Free Gemini Advanced with Google One Premium",
          icon: <CrownOutlined style={{ color: '#faad14' }} />
        },
        {
          title: "Workspace Integration",
          description: "Seamless integration with Google Workspace",
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
        }
      ],
      rating: 4.6,
      category: "Multimodal AI",
      color: "#4285f4",
      website: "https://gemini.google.com",
      views: 750000
    },
    {
      id: 4,
      name: "Claude",
      company: "Anthropic",
      logo: <SiAnthropic style={{ fontSize: '32px', color: '#ff6b35' }} />,
      description: "Constitutional AI assistant focused on safety, helpfulness, and harmlessness.",
      features: [
        "Constitutional AI principles",
        "Long context windows",
        "Document analysis",
        "Creative writing",
        "Code assistance"
      ],
      pricing: "Free tier available, Pro: $20/month",
      offers: [
        {
          title: "Team Collaboration",
          description: "Unlimited conversations for teams",
          icon: <TeamOutlined style={{ color: '#1890ff' }} />
        },
        {
          title: "Enterprise Security",
          description: "SOC 2 Type II certified",
          icon: <SafetyOutlined style={{ color: '#52c41a' }} />
        }
      ],
      rating: 4.9,
      category: "Conversational AI",
      color: "#ff6b35",
      website: "https://claude.ai",
      views: 650000
    },
    {
      id: 5,
      name: "Copilot",
      company: "Microsoft",
      logo: <SiGithub style={{ fontSize: '32px', color: '#2ea44f' }} />,
      description: "AI-powered coding assistant that helps developers write better code faster.",
      features: [
        "Code completion",
        "Bug detection",
        "Documentation generation",
        "Multi-language support",
        "IDE integration"
      ],
      pricing: "Free for students, Individual: $10/month",
      offers: [
        {
          title: "Student Benefits",
          description: "Free GitHub Copilot for students",
          icon: <GiftOutlined style={{ color: '#52c41a' }} />
        },
        {
          title: "Enterprise Features",
          description: "Advanced security and compliance",
          icon: <SafetyOutlined style={{ color: '#1890ff' }} />
        }
      ],
      rating: 4.5,
      category: "Development",
      color: "#2ea44f",
      website: "https://github.com/features/copilot",
      views: 520000
    },
    {
      id: 6,
      name: "Notion AI",
      company: "Notion",
      logo: <SiNotion style={{ fontSize: '32px', color: '#000000' }} />,
      description: "AI-powered workspace that helps you write, plan, and organize your work.",
      features: [
        "Smart writing assistance",
        "Task automation",
        "Knowledge management",
        "Team collaboration",
        "Template generation"
      ],
      pricing: "Free tier available, AI add-on: $10/month",
      offers: [
        {
          title: "Team Plans",
          description: "Bulk discounts for teams of 5+",
          icon: <TeamOutlined style={{ color: '#1890ff' }} />
        },
        {
          title: "Education Discount",
          description: "Free Notion for educational institutions",
          icon: <GiftOutlined style={{ color: '#52c41a' }} />
        }
      ],
      rating: 4.4,
      category: "Productivity",
      color: "#000000",
      website: "https://notion.so",
      views: 380000
    }
  ];

  const categories = ['All', ...new Set(aiTools.map(tool => tool.category))];

  const filteredTools = aiTools
    .filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.pricing.localeCompare(b.pricing);
        default:
          return b.rating - a.rating;
      }
    });

  const showModal = (tool) => {
    setSelectedTool(tool);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTool(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '80px 0',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  padding: '20px',
                  marginRight: '20px'
                }}>
                  <ExperimentOutlined style={{ fontSize: '48px' }} />
                </div>
                <Title level={1} style={{ margin: 0, color: 'white' }}>
                  AI Tools Hub
                </Title>
              </div>
              <Title level={3} style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontWeight: 'normal' }}>
                Discover the best AI tools to supercharge your productivity and creativity
              </Title>
              <Row gutter={[32, 16]} justify="center">
                <Col>
                  <Statistic 
                    title="AI Tools" 
                    value={aiTools.length} 
                    prefix={<RocketOutlined />}
                    valueStyle={{ color: 'rgba(255,255,255,0.9)' }}
                  />
                </Col>
                <Col>
                  <Statistic 
                    title="Categories" 
                    value={categories.length - 1} 
                    prefix={<BulbOutlined />}
                    valueStyle={{ color: 'rgba(255,255,255,0.9)' }}
                  />
                </Col>
                <Col>
                  <Statistic 
                    title="Active Offers" 
                    value={aiTools.reduce((acc, tool) => acc + tool.offers.length, 0)} 
                    prefix={<GiftOutlined />}
                    valueStyle={{ color: 'rgba(255,255,255,0.9)' }}
                  />
                </Col>
              </Row>
            </Space>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ padding: '48px 0' }}>
        {/* Search and Filter */}
        <Card style={{ 
          marginBottom: '32px', 
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e8e8e8',
          backgroundColor: '#ffffff'
        }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} lg={8}>
              <Input
                placeholder="Search AI tools..."
                prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="large"
                style={{ borderRadius: '12px' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                size="large"
                style={{ width: '100%', borderRadius: '12px' }}
                placeholder="Select Category"
              >
                {categories.map((category) => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={24} lg={8}>
              <Select
                value={sortBy}
                onChange={setSortBy}
                size="large"
                style={{ width: '100%', borderRadius: '12px' }}
                placeholder="Sort by"
              >
                <Option value="rating">Sort by Rating</Option>
                <Option value="name">Sort by Name</Option>
                <Option value="price">Sort by Price</Option>
              </Select>
            </Col>
          </Row>
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <Text type="secondary">
              Showing {filteredTools.length} of {aiTools.length} AI tools
            </Text>
          </div>
        </Card>

        {/* Tools Grid - Simplified Cards */}
        <Row gutter={[24, 24]}>
          {filteredTools.map((tool) => (
            <Col xs={24} sm={12} lg={8} key={tool.id}>
              <Card
                hoverable
                style={{ 
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #e8e8e8',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  backgroundColor: '#ffffff'
                }}
                bodyStyle={{ 
                  padding: '24px', 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: '1px solid transparent'
                }}
                className="ai-tool-card"
              >
                {tool.isPopular && (
                  <Badge.Ribbon 
                    text="Popular" 
                    color="red"
                    style={{ position: 'absolute', top: '16px', right: '16px' }}
                  >
                    <FireOutlined style={{ color: '#ff4d4f' }} />
                  </Badge.Ribbon>
                )}
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Logo and Title */}
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '80px',
                      height: '80px',
                      backgroundColor: tool.color,
                      borderRadius: '50%',
                      margin: '0 auto 16px',
                      boxShadow: `0 8px 24px ${tool.color}40`
                    }}>
                      {tool.logo}
                    </div>
                    <Title level={3} style={{ margin: '8px 0', color: '#262626' }}>
                      {tool.name}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      {tool.company}
                    </Text>
                  </div>

                  {/* Description */}
                  <Paragraph style={{ 
                    textAlign: 'center', 
                    margin: '0 0 20px 0', 
                    color: '#595959',
                    flex: 1
                  }}>
                    {tool.description}
                  </Paragraph>

                  {/* Rating and Views */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '16px',
                    marginBottom: '20px'
                  }}>
                    <Rate disabled defaultValue={tool.rating} style={{ fontSize: '14px' }} />
                    <Text type="secondary" style={{ marginLeft: '8px' }}>
                      {tool.rating}
                    </Text>
                    <Space>
                      <EyeOutlined style={{ color: '#8c8c8c' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {tool.views.toLocaleString()}
                      </Text>
                    </Space>
                  </div>

                  {/* Action Buttons */}
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Button 
                      type="default" 
                      size="large" 
                      block
                      icon={<InfoCircleOutlined />}
                      onClick={() => showModal(tool)}
                      style={{ 
                        borderRadius: '12px',
                        height: '40px'
                      }}
                    >
                      View Details
                    </Button>
                    <Button 
                      type="primary" 
                      size="large" 
                      block
                      icon={<LinkOutlined />}
                      onClick={() => window.open(tool.website, '_blank')}
                      style={{ 
                        borderRadius: '12px',
                        background: tool.color,
                        borderColor: tool.color,
                        height: '40px'
                      }}
                    >
                      Visit {tool.name}
                    </Button>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredTools.length === 0 && (
          <Card style={{ 
            textAlign: 'center', 
            padding: '64px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e8e8e8',
            backgroundColor: '#ffffff'
          }}>
            <Space direction="vertical" size="large">
              <SearchOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
              <div>
                <Title level={4} style={{ margin: 0, color: '#8c8c8c' }}>
                  No AI tools found
                </Title>
                <Text type="secondary">
                  Try adjusting your search or filter criteria
                </Text>
              </div>
            </Space>
          </Card>
        )}
      </div>

      {/* Newsletter Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '80px 0',
        color: 'white',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <RocketOutlined style={{ fontSize: '48px' }} />
              </div>
              <Title level={2} style={{ margin: 0, color: 'white' }}>
                Stay Updated with AI Tools
              </Title>
              <Text style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)' }}>
                Get notified about the latest AI tools, updates, and exclusive offers
              </Text>
              <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={16}>
                  <Input 
                    size="large" 
                    placeholder="Enter your email"
                    style={{ borderRadius: '12px' }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Button 
                    type="primary" 
                    size="large" 
                    block
                    style={{ 
                      borderRadius: '12px',
                      background: 'white',
                      color: '#667eea',
                      borderColor: 'white',
                      height: '40px',
                      fontWeight: '500'
                    }}
                  >
                    Subscribe
                  </Button>
                </Col>
              </Row>
            </Space>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#001529', color: 'white', padding: '32px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Text style={{ color: '#8c8c8c' }}>
            © 2024 AI Tools Hub. Discover the best AI tools to enhance your workflow.
          </Text>
        </div>
      </div>

      {/* Detailed Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '48px',
              height: '48px',
              backgroundColor: selectedTool?.color || '#1890ff',
              borderRadius: '50%'
            }}>
              {selectedTool?.logo}
            </div>
            <div>
              <Title level={4} style={{ margin: 0 }}>{selectedTool?.name}</Title>
              <Text type="secondary">{selectedTool?.company}</Text>
            </div>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Close
          </Button>,
          <Button 
            key="visit" 
            type="primary" 
            icon={<LinkOutlined />}
            onClick={() => {
              window.open(selectedTool?.website, '_blank');
              handleCancel();
            }}
            style={{ 
              background: selectedTool?.color,
              borderColor: selectedTool?.color
            }}
          >
            Visit {selectedTool?.name}
          </Button>
        ]}
        width={800}
        style={{ top: 20 }}
      >
        {selectedTool && (
          <div style={{ padding: '20px 0' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Description */}
              <div>
                <Title level={5}>Description</Title>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                  {selectedTool.description}
                </Paragraph>
              </div>

              {/* Rating and Stats */}
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic 
                    title="Rating" 
                    value={selectedTool.rating} 
                    prefix={<StarOutlined style={{ color: '#faad14' }} />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="Views" 
                    value={selectedTool.views.toLocaleString()} 
                    prefix={<EyeOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="Category" 
                    value={selectedTool.category} 
                    prefix={<BulbOutlined />}
                  />
                </Col>
              </Row>

              {/* Features */}
              <div>
                <Title level={5}>
                  <ThunderboltOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                  Key Features
                </Title>
                <List
                  dataSource={selectedTool.features}
                  renderItem={(feature) => (
                    <List.Item style={{ padding: '8px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                        <Text>{feature}</Text>
                      </div>
                    </List.Item>
                  )}
                />
              </div>

              {/* Pricing */}
              <div>
                <Title level={5}>
                  <CrownOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                  Pricing
                </Title>
                <Card size="small" style={{ backgroundColor: '#f8f9fa' }}>
                  <Text strong style={{ fontSize: '16px' }}>{selectedTool.pricing}</Text>
                </Card>
              </div>

              {/* Offers */}
              {selectedTool.offers.length > 0 && (
                <div>
                  <Title level={5}>
                    <GiftOutlined style={{ marginRight: '8px', color: '#eb2f96' }} />
                    Current Offers
                  </Title>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {selectedTool.offers.map((offer, index) => (
                      <Card 
                        key={index} 
                        size="small" 
                        style={{ 
                          backgroundColor: '#fff7e6',
                          border: '1px solid #ffd591'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {offer.icon}
                          <div style={{ marginLeft: '8px' }}>
                            <Text strong style={{ fontSize: '14px' }}>{offer.title}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: '13px' }}>
                              {offer.description}
                            </Text>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </Space>
                </div>
              )}
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AIToolsPage;
