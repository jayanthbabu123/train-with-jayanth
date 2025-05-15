import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole
} from "@codesandbox/sandpack-react";

export default function PracticeSandpack({ starterCode }) {
  return (
    <div className="h-full bg-background-dark">
      <SandpackProvider
        template="react"
        files={{
          "/App.js": starterCode,
        }}
        theme="dark"
      >
        <SandpackLayout className="h-full flex flex-col">
          <div className="flex-1 flex min-h-0">
            {/* Code Editor */}
            <div className="w-1/2 h-full min-w-[200px]">
              <SandpackCodeEditor
                showLineNumbers
                showTabs
                wrapContent
                style={{ height: "100%" }}
                className="h-full"
              />
            </div>
            {/* Preview + Console */}
            <div className="w-1/2 h-full min-w-[200px] flex flex-col">
              <div className="flex-1 min-h-0">
                <SandpackPreview style={{ height: "100%" }} className="h-full" />
              </div>
              <div className="h-40 border-t border-gray-700 bg-gray-900">
                <SandpackConsole
                  className="h-full"
                  style={{ height: "100%", background: "inherit" }}
                  standalone={false}
                  showHeader={true}
                />
              </div>
            </div>
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}