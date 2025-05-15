import { useState } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import ReactMarkdown from 'react-markdown';

export default function AssignmentEditor({ initialData, onSave }) {
  const [data, setData] = useState(initialData || {
    title: '',
    description: '',
    problemStatement: '',
    sampleCode: `// Write your solution here
function solution() {
  // Your code goes here
}`,
    testCases: '',
    difficulty: 'beginner',
    dueDate: '',
  });

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(data);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Title and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                placeholder="Assignment Title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={data.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
              rows="3"
              placeholder="Brief description of the assignment"
              required
            />
          </div>

          {/* Problem Statement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Problem Statement</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Markdown Editor</span>
                </div>
              </div>
              <textarea
                value={data.problemStatement}
                onChange={(e) => handleChange('problemStatement', e.target.value)}
                className="w-full px-4 py-3 font-mono text-sm focus:outline-none"
                rows="10"
                placeholder="Write the problem statement in markdown format..."
              />
            </div>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <div className="prose max-w-none">
                <ReactMarkdown>{data.problemStatement}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Sample Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sample Code</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <Sandpack
                template="react"
                files={{
                  '/App.js': data.sampleCode,
                }}
                options={{
                  showNavigator: true,
                  showTabs: true,
                  showLineNumbers: true,
                  showInlineErrors: true,
                  closableTabs: false,
                  wrapContent: true,
                }}
                theme="dark"
              />
            </div>
          </div>

          {/* Test Cases */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Cases</label>
            <textarea
              value={data.testCases}
              onChange={(e) => handleChange('testCases', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7] font-mono text-sm"
              rows="5"
              placeholder="Enter test cases in JSON format..."
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={data.difficulty}
              onChange={(e) => handleChange('difficulty', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => onSave(null)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0284c7] text-white rounded-lg hover:bg-[#0369a1]"
          >
            Save Assignment
          </button>
        </div>
      </form>
    </div>
  );
} 