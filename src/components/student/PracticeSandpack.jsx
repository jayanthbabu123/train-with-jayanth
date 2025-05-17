import { Card, Typography } from 'antd';
import React from 'react';
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { freeCodeCampDark } from "@codesandbox/sandpack-themes";

const { Title } = Typography;

export default function PracticeSandpack({ starterCode, showConsole = true }) {
  return (
    <Card
      bordered={false}
      style={{
        height: '100%',
        background: '#1a1a1a',
        borderRadius: '12px',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
     
    >
      <Title level={4} style={{ color: '#fff', margin: 0 }}>
        Code Editor
      </Title>
      <SandpackProvider
        template="react"
        files={{
          "/App.js": starterCode,
        }}
        theme={freeCodeCampDark}
        options={{
          recompileMode: "delayed", // or "immediate"
          recompileDelay: 1000,  
          editorHeight: 280, // default - 300
          editorWidthPercentage: 60, // default - 50    // delay in ms (only used if recompileMode is "delayed")
          // ...other options
        }}
      >
        <PanelGroup direction="horizontal" style={{ flex: 1, minHeight: 0, height: '100%' }}>
          <Panel defaultSize={50} minSize={25} maxSize={75} style={{ minWidth: 220, maxWidth: '80%', height: '100%', minHeight: 0, width: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            <SandpackCodeEditor
              showLineNumbers
              showTabs
              wrapContent
              showRunButton
              showCompileButton
              style={{ height: '100%', width: '100%', flex: 1 }}
            />
          </Panel>
          <PanelResizeHandle style={{ width: 10, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 4, height: 48, borderRadius: 2, background: 'linear-gradient(135deg, #0067b8 0%, #1e3a8a 100%)', boxShadow: '0 0 4px #0067b8' }} />
          </PanelResizeHandle>
          <Panel minSize={25} style={{ minWidth: 0, height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            <div style={{ flex: 1, minHeight: 0, borderBottom: '1px solid #222', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
              <SandpackPreview style={{ height: '100%', borderRadius: 0, overflow: 'auto', minHeight: 0, flex: 1 }} />
            </div>
            {showConsole && (
              <div style={{ flex: 1, minHeight: 0, background: '#181818', borderRadius: '0 0 8px 8px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                <SandpackConsole
                  style={{ height: '100%', background: 'inherit', borderRadius: 0, overflow: 'auto', minHeight: 0, flex: 1 }}
                  standalone={false}
                  showHeader={true}
                />
              </div>
            )}
          </Panel>
        </PanelGroup>
      </SandpackProvider>
    </Card>
  );
}