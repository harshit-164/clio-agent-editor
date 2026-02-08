import { WebContainer } from '@webcontainer/api';

class WebContainerService {
  private static instance: WebContainerService;
  private webContainerPromise: Promise<WebContainer> | null = null;
  private webContainerInstance: WebContainer | null = null;

  private constructor() {}

  public static getInstance(): WebContainerService {
    if (!WebContainerService.instance) {
      WebContainerService.instance = new WebContainerService();
    }
    return WebContainerService.instance;
  }

  public async getWebContainer(): Promise<WebContainer> {
    // If instance already exists in memory, return it immediately
    if (this.webContainerInstance) {
      return this.webContainerInstance;
    }

    // If we are currently in the middle of booting, return that existing promise
    if (this.webContainerPromise) {
      return this.webContainerPromise;
    }

    // Start the boot process for the first time
    this.webContainerPromise = WebContainer.boot();

    try {
      this.webContainerInstance = await this.webContainerPromise;
      return this.webContainerInstance;
    } catch (error) {
      // If boot fails, reset the promise so we can try again later
      this.webContainerPromise = null;
      throw error;
    }
  }
}

// Export a single instance to be used everywhere in the app
export const webContainerService = WebContainerService.getInstance();