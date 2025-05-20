import { Card, Typography } from 'antd';
import React, { useCallback, useEffect } from 'react';
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
  useActiveCode,
} from "@codesandbox/sandpack-react";
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { freeCodeCampDark } from "@codesandbox/sandpack-themes";

const { Title } = Typography;

function CodeEditor({ onCodeChange }) {
  const { sandpack } = useSandpack();
  const { activeFile, files } = sandpack;
  const { code, updateCode } = useActiveCode();

  console.log('Current active file:', activeFile);
  console.log('Current files state:', files);
  console.log('Current active code:', code);

  // Watch for code changes
  useEffect(() => {
    if (code && onCodeChange) {
      console.log('Code changed, updating parent:', code);
      
      // Create updated files object with the correct format
      const updatedFiles = Object.keys(files).reduce((acc, filePath) => {
        const fileData = files[filePath];
        acc[filePath] = {
          code: filePath === activeFile ? code : fileData.code,
          hidden: false,
          active: filePath === activeFile,
          readOnly: false
        };
        return acc;
      }, {});

      console.log('Sending updated files to parent:', updatedFiles);
      onCodeChange(updatedFiles);
    }
  }, [code, activeFile, files, onCodeChange]);

  return (
    <SandpackCodeEditor
      showLineNumbers
      showTabs
      wrapContent
      showRunButton
      showCompileButton
      style={{ height: '100%', width: '100%', flex: 1 }}
    />
  );
}

export default function PracticeSandpack({ template = 'react', files = {}, onCodeChange, showConsole = true }) {
  console.log('PracticeSandpack received initial files:', files);

  // Ensure initial files have the correct format
  const formattedFiles = Object.keys(files).reduce((acc, filePath) => {
    const fileData = files[filePath];
    acc[filePath] = {
      code: typeof fileData === 'string' ? fileData : fileData.code,
      hidden: false,
      active: filePath === '/index.html',
      readOnly: false
    };
    return acc;
  }, {});

  console.log('Formatted initial files:', formattedFiles);

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
        template={template}
        files={formattedFiles}
        theme={freeCodeCampDark}
        options={{
          recompileMode: "delayed",
          recompileDelay: 1000,  
          editorHeight: 280,
          editorWidthPercentage: 60,
          activeFile: '/index.html',
          visibleFiles: ['/index.html', '/index.js'],
        }}
      >
        <PanelGroup direction="horizontal" style={{ flex: 1, minHeight: 0, height: '100%' }}>
          <Panel defaultSize={50} minSize={25} maxSize={75} style={{ minWidth: 220, maxWidth: '80%', height: '100%', minHeight: 0, width: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            <CodeEditor onCodeChange={onCodeChange} />
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