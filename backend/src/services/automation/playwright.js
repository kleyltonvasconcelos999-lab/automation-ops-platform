import { chromium, firefox, webkit } from 'playwright';
import { logger } from '../../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

class PlaywrightService {
  constructor() {
    this.sessions = new Map();
    this.browserContexts = new Map();
  }

  async createSession(options = {}) {
    const sessionId = uuidv4();
    const browserType = options.browser || 'chromium';
    const headless = options.headless !== false;

    try {
      logger.info(`Starting Playwright session: ${sessionId}`);

      let browser;
      if (browserType === 'firefox') {
        browser = await firefox.launch({ headless });
      } else if (browserType === 'webkit') {
        browser = await webkit.launch({ headless });
      } else {
        browser = await chromium.launch({ headless });
      }

      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
      });

      const page = await context.newPage();

      this.sessions.set(sessionId, {
        browser,
        context,
        page,
        createdAt: new Date(),
        logs: [],
        screenshots: [],
      });

      logger.info(`Session created: ${sessionId}`);
      return sessionId;
    } catch (error) {
      logger.error(`Error creating session: ${error.message}`);
      throw error;
    }
  }

  async closeSession(sessionId) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    try {
      await session.browser.close();
      this.sessions.delete(sessionId);
      logger.info(`Session closed: ${sessionId}`);
    } catch (error) {
      logger.error(`Error closing session: ${error.message}`);
      throw error;
    }
  }

  async navigateTo(sessionId, url) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    try {
      logger.info(`Navigating to ${url}`);
      await session.page.goto(url, {
        waitUntil: 'networkidle',
        timeout: parseInt(process.env.PLAYWRIGHT_TIMEOUT || '30000'),
      });
      return true;
    } catch (error) {
      logger.error(`Navigation error: ${error.message}`);
      throw error;
    }
  }

  async fillField(sessionId, selector, value) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    try {
      await session.page.fill(selector, value);
      logger.info(`Filled field: ${selector}`);
      return true;
    } catch (error) {
      logger.error(`Fill error: ${error.message}`);
      throw error;
    }
  }

  async clickElement(sessionId, selector) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    try {
      await session.page.click(selector);
      logger.info(`Clicked element: ${selector}`);
      return true;
    } catch (error) {
      logger.error(`Click error: ${error.message}`);
      throw error;
    }
  }

  async takeScreenshot(sessionId) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    try {
      const screenshot = await session.page.screenshot();
      logger.info(`Screenshot taken for session: ${sessionId}`);
      return screenshot;
    } catch (error) {
      logger.error(`Screenshot error: ${error.message}`);
      throw error;
    }
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  getAllSessions() {
    return Array.from(this.sessions.values());
  }
}

export const playwrightService = new PlaywrightService();
