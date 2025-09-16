import { PythonConsole } from '@/components/PythonConsole';
import '@/index.css';

function App() {
  return (
    <div className="h-screen w-full bg-background text-foreground">
      <PythonConsole />
    </div>
  );
}

export default App;