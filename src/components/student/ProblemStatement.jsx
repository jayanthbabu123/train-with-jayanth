import ReactMarkdown from "react-markdown";

export default function ProblemStatement({ markdown }) {
  return (
    <div className="h-full overflow-y-auto p-6 bg-background-dark border-r border-primary-800">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
} 