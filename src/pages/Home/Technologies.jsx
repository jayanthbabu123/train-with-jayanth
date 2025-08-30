import {
  Html5,
  Css3,
  FileCode,
  React as ReactIcon,
  GitBranch,
  Github,
  TerminalSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function TechnologiesSection() {
  const navigate = useNavigate();

  const technologies = [
    {
      icon: <Html5 className="w-10 h-10 text-blue-600" />,
      title: "HTML5",
      desc: "Learn the structure of webpages using semantic HTML and best practices.",
    },
    {
      icon: <Css3 className="w-10 h-10 text-blue-600" />,
      title: "CSS3",
      desc: "Style your websites beautifully using Flexbox, Grid, and transitions.",
    },
    {
      icon: <FileCode className="w-10 h-10 text-blue-600" />,
      title: "JavaScript",
      desc: "Master the language of the web with modern ES6+ features and logic.",
    },
    {
      icon: <ReactIcon className="w-10 h-10 text-blue-600" />,
      title: "React.js",
      desc: "Build interactive UIs with components, props, state, hooks, and more.",
    },
    {
      icon: <TerminalSquare className="w-10 h-10 text-blue-600" />,
      title: "Angular",
      desc: "Understand component-driven architecture and TypeScript with Angular.",
    },
    {
      icon: <GitBranch className="w-10 h-10 text-blue-600" />,
      title: "Git & GitHub",
      desc: "Track your code, collaborate, and build a visible portfolio on GitHub.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20 px-6 lg:px-20">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-14">
        Technologies You’ll Master
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {technologies.map((tech, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-6 shadow-md border-t-4 border-green-500 hover:shadow-lg transition"
          >
            {tech.icon}
            <h3 className="text-xl font-semibold mt-4 mb-2">{tech.title}</h3>
            <p className="text-gray-600 mb-4">{tech.desc}</p>
            <button
              onClick={() => navigate("/syllabus")}
              className="text-sm font-semibold text-white bg-green-500 px-4 py-2 rounded hover:brightness-110 transition"
            >
              View Syllabus
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TechnologiesSection;
