export default function PracticeLayout({ children }) {
  return (
    <div className="h-[calc(100vh-4rem)] bg-background-gradient">
      <div className="grid grid-cols-2 h-full">
        {children}
      </div>
    </div>
  );
} 