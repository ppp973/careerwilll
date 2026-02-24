import { useEffect } from 'react';
import disableDevtool from 'disable-devtool';

export default function SecurityManager() {
  useEffect(() => {
    // 1. Initialize disable-devtool
    // This library handles DevTools detection and can disable right-click, shortcuts, etc.
    disableDevtool({
      ondevtoolopen: (type) => {
        // If devtools is opened, redirect to a blank page or close
        window.location.href = "about:blank";
      },
      clearLog: true,
      disableMenu: true,
      disableCopy: true,
      disableCut: true,
      disablePaste: true,
      disableSelect: true,
    });

    // 2. Additional anti-debugging measures
    const antiDebug = () => {
      const startTime = performance.now();
      // This is a common trick to detect if DevTools is open
      // by measuring the time it takes to execute a debugger statement
      (function() {
        const devtools = { open: false };
        const threshold = 160;
        const emit = () => {
          window.location.href = "about:blank";
        };
        
        // Check 1: debugger timing
        const t1 = performance.now();
        // eslint-disable-next-line no-debugger
        debugger;
        const t2 = performance.now();
        if (t2 - t1 > threshold) {
          emit();
        }

        // Check 2: element id trick
        const element = new Image();
        Object.defineProperty(element, 'id', {
          get: function() {
            emit();
          }
        });
        console.log(element);
      })();

      const endTime = performance.now();
      if (endTime - startTime > 100) {
        window.location.href = "about:blank";
      }
    };

    const interval = setInterval(antiDebug, 500);

    // 3. Prevent common view-source shortcuts manually as backup
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+U (View Source), Ctrl+Shift+I (Inspect), F12, Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect)
      if (
        (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'j' || e.key === 'J')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'c' || e.key === 'C')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // 4. Disable right-click as backup
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return null;
}
