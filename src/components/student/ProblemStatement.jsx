import ReactMarkdown from "react-markdown";
import { Typography, Card } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

const StyledMarkdown = styled.div`
  .markdown-content {
    color: #e5e7eb;
    font-size: 14px;
    line-height: 1.6;

    h1, h2, h3, h4, h5, h6 {
      color: #fff;
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
    }

    h1 { font-size: 24px; }
    h2 { font-size: 20px; }
    h3 { font-size: 18px; }
    h4 { font-size: 16px; }

    p {
      margin-bottom: 16px;
    }

    ul, ol {
      margin-bottom: 16px;
      padding-left: 24px;
    }

    li {
      margin-bottom: 8px;
    }

    code {
      background: rgba(255, 255, 255, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }

    pre {
      background: rgba(0, 0, 0, 0.2);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 16px 0;
    }
  }
`;

export default function ProblemStatement({ markdown }) {
  return (
    <Card
      bordered={false}
      style={{
        height: '100%',
        background: '#1a1a1a',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
      bodyStyle={{ 
        height: '100%',
        overflow: 'auto'
      }}
    >
      <Title level={4} style={{ color: '#fff', marginBottom: '24px' }}>
        Problem Statement
      </Title>
      <StyledMarkdown>
        <div className="markdown-content">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </StyledMarkdown>
    </Card>
  );
} 