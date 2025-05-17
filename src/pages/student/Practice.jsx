import PracticeLayout from "../../components/student/PracticeLayout";
import ProblemStatement from "../../components/student/ProblemStatement";
import PracticeSandpack from "../../components/student/PracticeSandpack";
import React from "react";

const starterCode = `import React, { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Counter</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          style={{
            padding: '8px 16px',
            background: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          onClick={() => setCount(count - 1)}
        >
          -
        </button>
        <span style={{ fontSize: '20px', fontWeight: '600' }}>{count}</span>
        <button 
          style={{
            padding: '8px 16px',
            background: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          onClick={() => setCount(count + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
`;

const problemStatement = `
# Build a Counter Component

Create a simple React counter component with the following features:

## Requirements

- Display the current count (start at 0)
- "+" button increases the count
- "-" button decreases the count
- Use React hooks (useState)
- Style the buttons and layout for a clean look

## Tips

- Use the \`useState\` hook to manage the count state
- Add event handlers for button clicks
- Style your component using CSS or inline styles
- Make sure the UI is responsive and user-friendly

## Example Usage

\`\`\`jsx
<Counter />
\`\`\`

## Expected Output

A centered counter with two buttons that increment and decrement the count.
`;

export default function StudentPractice() {
  return (
    <PracticeLayout>
      <div style={{ minWidth: 320, maxWidth: 'auto', flex: '0 0 32%', height: '100%' }}>
        <ProblemStatement markdown={problemStatement} />
      </div>
      <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
        <PracticeSandpack starterCode={starterCode} showConsole={true} />
      </div>
    </PracticeLayout>
  );
} 