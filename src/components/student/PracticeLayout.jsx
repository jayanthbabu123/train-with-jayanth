import { Layout } from 'antd';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

const { Content } = Layout;

export default function PracticeLayout({ children }) {
  // children[0] = ProblemStatement, children[1] = PracticeSandpack
  return (
    <Layout style={{ height: 'calc(100vh - 6rem)', background: 'var(--background-gradient)' }}>
      <Content style={{  height: '100%' }}>
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
  );
} 