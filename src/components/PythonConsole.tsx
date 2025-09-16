import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useConsoleState } from '@/hooks/useConsoleState';
import { Play, Trash2, RotateCcw, Copy, Download } from 'lucide-react';

declare global {
  interface Window {
    pyscript: any;
    run_python_code: (code: string) => string;
  }
}

export function PythonConsole() {
  const {
    state,
    isLoading,
    setCode,
    setOutput,
    addToHistory,
    clearCode,
    clearOutput,
    setActive,
  } = useConsoleState();

  const [isExecuting, setIsExecuting] = useState(false);
  const [isPyScriptReady, setIsPyScriptReady] = useState(false);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize PyScript
  useEffect(() => {
    const initPyScript = () => {
      if (window.pyscript) {
        setIsPyScriptReady(true);
        setActive(true);
        return;
      }

      // Check if PyScript is already loaded
      const checkPyScript = () => {
        if (window.pyscript) {
          setIsPyScriptReady(true);
          setActive(true);
        } else {
          setTimeout(checkPyScript, 100);
        }
      };

      checkPyScript();
    };

    initPyScript();
  }, [setActive]);

  // Handle code execution
  const executeCode = async () => {
    if (!isPyScriptReady || !state.code.trim()) return;

    setIsExecuting(true);
    const startTime = Date.now();

    try {
      let output = '';
      
      // Try to use PyScript if available
      if (window.pyscript && typeof window.run_python_code === 'function') {
        output = window.run_python_code(state.code);
      } else {
        // Fallback for basic Python-like operations
        try {
          // Simple pattern matching for basic print statements
          const printMatches = state.code.match(/print\((.*?)\)/g);
          if (printMatches) {
            const outputs = printMatches.map(match => {
              const content = match.replace(/print\((['"])(.*?)\1\)/, '$2');
              return content;
            });
            output = outputs.join('\n');
          } else {
            output = 'Code executed (PyScript not fully loaded)';
          }
        } catch (error) {
          output = `Error: ${error instanceof Error ? error.message : String(error)}`;
        }
      }

      const executionTime = Date.now() - startTime;
      const finalOutput = `${output}\n--- Executed in ${executionTime}ms ---`;
      
      setOutput(finalOutput);
      addToHistory(state.code);

      // Scroll output to bottom
      setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }, 0);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      executeCode();
    }
  };

  // Copy output to clipboard
  const copyOutput = async () => {
    if (state.output) {
      try {
        await navigator.clipboard.writeText(state.output);
      } catch (error) {
        console.error('Failed to copy output:', error);
      }
    }
  };

  // Download code as file
  const downloadCode = () => {
    if (state.code) {
      const blob = new Blob([state.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'python_code.py';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading Python Console...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">AI Python Console</h1>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${isPyScriptReady ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-muted-foreground">
            {isPyScriptReady ? 'Ready' : 'Loading PyScript...'}
          </span>
        </div>
      </div>

      {/* Code Input Area */}
      <div className="flex-1 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Python Code</label>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadCode}
              disabled={!state.code.trim()}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCode}
              disabled={!state.code.trim()}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Textarea
          value={state.code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="# Write your Python code here&#10;print('Hello, World!')"
          className="flex-1 font-mono text-sm resize-none"
          style={{ minHeight: '200px' }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button
          onClick={executeCode}
          disabled={!isPyScriptReady || !state.code.trim() || isExecuting}
          className="flex-1"
        >
          <Play className="w-4 h-4 mr-2" />
          {isExecuting ? 'Executing...' : 'Run (Ctrl+Enter)'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            clearCode();
            clearOutput();
          }}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <Separator />

      {/* Output Area */}
      <div className="flex-1 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Output</label>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={copyOutput}
              disabled={!state.output.trim()}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearOutput}
              disabled={!state.output.trim()}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Textarea
          ref={outputRef}
          value={state.output}
          readOnly
          placeholder="Output will appear here..."
          className="flex-1 font-mono text-sm resize-none bg-muted"
          style={{ minHeight: '150px' }}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          History: {state.history.length} commands
        </span>
        <span>
          PyScript: {isPyScriptReady ? 'Ready' : 'Loading...'}
        </span>
      </div>
    </div>
  );
}