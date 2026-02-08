import { useState, useEffect, useCallback, useRef } from 'react';
import { WebContainer } from '@webcontainer/api';
import { TemplateFolder } from '@/features/playground/types'; // Updated import path to match your types
import { webContainerService } from '../service/webContainerService'; // Import the service we just fixed

interface UseWebContainerProps {
  templateData: TemplateFolder;
}

interface UseWebContainerReturn {
  instance: WebContainer | null;
  isLoading: boolean;
  error: string | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
}

export const useWebContainer = ({ templateData }: UseWebContainerProps): UseWebContainerReturn => {
  const [instance, setInstance] = useState<WebContainer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to track if we've already mounted files
  const isMounted = useRef(false);

  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        setIsLoading(true);
        // GET the singleton instance instead of booting a new one
        const webContainer = await webContainerService.getWebContainer();
        
        if (active) {
          setInstance(webContainer);
          
          // Only mount files once per session to avoid overwriting user changes on re-renders
          if (!isMounted.current && templateData) {
            console.log("Mounting files to WebContainer...");
            // Convert your templateData format to WebContainer's FileSystemTree format if needed
            // For now, assuming you handle the initial file mount logic elsewhere or here
            // If you need to mount immediately, use webContainer.mount(tree)
            isMounted.current = true;
          }
          
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error("WebContainer init error:", err);
        if (active) {
          setError(err.message || 'Failed to initialize WebContainer');
          setIsLoading(false);
        }
      }
    };

    init();

    // CLEANUP: We DO NOT teardown the instance here.
    // We want it to stay alive even if this component unmounts (tab switch).
    return () => {
      active = false;
    };
  }, []); // Empty dependency array = run once on mount

  const writeFileSync = useCallback(async (path: string, content: string) => {
    if (!instance) return;
    try {
      await instance.fs.writeFile(path, content);
    } catch (error) {
      console.error('Error writing file:', error);
    }
  }, [instance]);

  return {
    instance,
    isLoading,
    error,
    writeFileSync,
  };
};