import { useState, useEffect, useCallback, useRef } from 'react';
import { WebContainer } from '@webcontainer/api';
import { TemplateFolder } from '@/features/playground/types'; // Make sure this path matches your project
import { webContainerService } from '../service/webContainerService';

interface UseWebContainerProps {
  templateData: TemplateFolder;
}

interface UseWebContainerReturn {
  instance: WebContainer | null;
  serverUrl: string | null; // <--- Added this to track the preview URL
  isLoading: boolean;
  error: string | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
}

export const useWebContainer = ({ templateData }: UseWebContainerProps): UseWebContainerReturn => {
  const [instance, setInstance] = useState<WebContainer | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const isMounted = useRef(false);

  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        setIsLoading(true);
        const webContainer = await webContainerService.getWebContainer();
        
        if (active) {
          setInstance(webContainer);

          // 1. Listen for when the server (localhost:3000) is ready
          webContainer.on('server-ready', (port, url) => {
            console.log(`Server ready at ${url}`);
            setServerUrl(url);
          });
          
          // 2. Mount Files (only once)
          if (!isMounted.current && templateData) {
            console.log("Mounting files...");
            await webContainer.mount(templateData);
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

    return () => {
      active = false;
    };
  }, [templateData]); // Re-run if templateData changes (be careful with this dependency)

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
    serverUrl, // <--- Return the URL
    isLoading,
    error,
    writeFileSync,
  };
};