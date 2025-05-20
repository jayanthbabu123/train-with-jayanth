import { Layout, Button, Space } from 'antd';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { PlayCircleOutlined, SaveOutlined } from '@ant-design/icons';

const { Content } = Layout;

export default function PracticeLayout({ 
  children, 
  onSubmit, 
  submitButtonText = 'Submit',
  showSubmitButton = true 
}) {
  // children[0] = ProblemStatement, children[1] = PracticeSandpack
  return (
    <div style={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)', 
      background: '#f5f6fa'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%',
        height: '100%'
      }}>
        <div style={{ 
          display: 'flex', 
          flex: 1,
          overflow: 'hidden'
        }}>
    <Layout style={{ height: 'calc(100vh - 6rem)', background: 'var(--background-gradient)' }}>
            <Content style={{ height: '100%' }}>
        <PanelGroup direction="horizontal" style={{ height: '100%' }}>
          <Panel defaultSize={32} minSize={20} maxSize={60} style={{ minWidth: 220, maxWidth: 600, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {children[0]}
          </Panel>
          <PanelResizeHandle style={{ width: 10, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 4, height: 48, borderRadius: 2, background: 'linear-gradient(135deg, #0067b8 0%, #1e3a8a 100%)', boxShadow: '0 0 4px #0067b8' }} />
          </PanelResizeHandle>
          <Panel minSize={20} style={{ minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {children[1]}
          </Panel>
        </PanelGroup>
      </Content>
    </Layout>
        </div>
        <div style={{ 
          padding: '16px',
          background: '#fff',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <Space>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => {
                // Handle run code
                const sandpackFrame = document.querySelector('iframe');
                if (sandpackFrame) {
                  sandpackFrame.contentWindow.postMessage({ type: 'run' }, '*');
                }
              }}
            >
              Run Code
            </Button>
            {showSubmitButton && (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={onSubmit}
              >
                {submitButtonText}
              </Button>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
} 