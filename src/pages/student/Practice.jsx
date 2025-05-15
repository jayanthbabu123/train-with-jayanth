import PracticeLayout from "../../components/student/PracticeLayout";
import ProblemStatement from "../../components/student/ProblemStatement";
import PracticeSandpack from "../../components/student/PracticeSandpack";
import React from "react";

const starterCode = `import React, { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4">Counter</h2>
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setCount(count - 1)}>-</button>
        <span className="text-xl font-semibold">{count}</span>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setCount(count + 1)}>+</button>
      </div>
    </div>
  );
}
`;

const problemStatement = `
 # Build a Counter Component

Create a simple React counter component with the following features:

- Display the current count (start at 0)
- "+" button increases the count
- "-" button decreases the count
- Use React hooks (useState)
- Style the buttons and layout for a clean look
`;

export default function StudentPractice() {
  // Adjust header height here if needed (e.g., 64px or 72px)
  const HEADER_HEIGHT = 150;
  return (
    <div
      className="flex flex-col lg:flex-row w-full gap-2 font-sans h-full"
      style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
    >
      {/* Problem Statement (33%) */}
      <div className="lg:w-1/3 w-full bg-white rounded-xl shadow-md border border-gray-200 h-full flex flex-col">
        <h2 className="text-xl font-bold text-[#1e3a8a] mb-4 px-4 pt-4">Problem</h2>
        <div className="flex-1 min-h-0 px-4 pb-4">
          <ProblemStatement markdown={problemStatement} />
        </div>
      </div>
      {/* Code Editor + Output (67%) */}
      <div className="lg:w-2/3 w-full bg-white rounded-xl shadow-md border border-gray-200 h-full flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#1e3a8a]">Code Editor</h2>
        </div>
        <div className="flex-1 min-h-0 flex flex-col">
          <PracticeSandpack starterCode={starterCode} showConsole={true} />
        </div>
      </div>
    </div>
  );
} 