import { useEffect, useRef } from 'react';
import * as monaco from '@monaco-editor/react';

export function CodeEditor({ value, onChange, language = 'javascript', height = '300px', readOnly = false }) {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px', overflow: 'hidden' }}>
      <monaco.Editor
        height={height}
        defaultLanguage={language}
        defaultValue={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          readOnly: readOnly,
          automaticLayout: true,
          theme: 'vs-light',
          padding: { top: 10, bottom: 10 },
        }}
      />
    </div>
  );
} 