const { chromium, firefox } = require('playwright');
const logger = require('../config/logger');
const config = require('../config');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const screenshotsDir = config.SCREENSHOTS_DIR;
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

class AutomationService {
  constructor() {
    this.activeSessions = new Map();
    this.activeContexts = new Map();
    this.activePages = new Map();
  }

  async createSession(automationId, userId, options = {}) {
    try {
      const sessionId = uuidv4();
      const browserType = options.browserType || 'chromium';
      const headless = options.headless !== undefined ? options.headless : config.PLAYWRIGHT_HEADLESS;

      logger.info(`🌐 Criando sessão ${sessionId} com ${browserType}`);

      let browser;
      if (browserType === 'firefox') {
        browser = await firefox.launch({ headless });
      } else {
        browser = await chromium.launch({ headless });
      }

      const context = await browser.newContext({
        viewport: {
          width: config.PLAYWRIGHT_VIEWPORT_WIDTH,
          height: config.PLAYWRIGHT_VIEWPORT_HEIGHT
        }
      });

      const page = await context.newPage();

      // Setup page listeners
      page.on('console', (msg) => logger.info(`[CONSOLE] ${msg.text()}`));
      page.on('error', (err) => logger.error(`[PAGE ERROR] ${err.message}`));

      this.activeSessions.set(sessionId, {
        id: sessionId,
        browser,
        automationId,
        userId,
        createdAt: new Date(),
        status: 'active'
      });

      this.activeContexts.set(sessionId, context);
      this.activePages.set(sessionId, page);

      logger.info(`✅ Sessão ${sessionId} criada com sucesso`);
      return { sessionId, status: 'active' };
    } catch (error) {
      logger.error('Erro ao criar sessão:', error);
      throw error;
    }
  }

  async getPage(sessionId) {
    const page = this.activePages.get(sessionId);
    if (!page) {
      throw new Error(`Página não encontrada para sessão ${sessionId}`);
    }
    return page;
  }

  async navigate(sessionId, url) {
    try {
      const page = await this.getPage(sessionId);
      logger.info(`📍 Navegando para ${url}`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: config.PLAYWRIGHT_TIMEOUT });
      return { success: true, url };
    } catch (error) {
      logger.error('Erro ao navegar:', error);
      throw error;
    }
  }

  async click(sessionId, selector) {
    try {
      const page = await this.getPage(sessionId);
      logger.info(`🖱️ Clicando em ${selector}`);
      await page.click(selector);
      return { success: true, selector };
    } catch (error) {
      logger.error('Erro ao clicar:', error);
      throw error;
    }
  }

  async fill(sessionId, selector, text) {
    try {
      const page = await this.getPage(sessionId);
      logger.info(`✍️ Preenchendo ${selector}`);
      await page.fill(selector, text);
      return { success: true, selector };
    } catch (error) {
      logger.error('Erro ao preencher:', error);
      throw error;
    }
  }

  async takeScreenshot(sessionId, executionId) {
    try {
      const page = await this.getPage(sessionId);
      const filename = `${executionId}_${uuidv4()}.png`;
      const filepath = path.join(screenshotsDir, filename);

      // Captura screenshot
      const buffer = await page.screenshot({ path: filepath });

      // Comprime imagem
      const compressedFilename = `${executionId}_${uuidv4()}_compressed.jpg`;
      const compressedFilepath = path.join(screenshotsDir, compressedFilename);

      await sharp(buffer)
        .jpeg({ quality: config.SCREENSHOT_COMPRESSION })
        .toFile(compressedFilepath);

      // Remove original
      fs.unlinkSync(filepath);

      const stats = fs.statSync(compressedFilepath);

      logger.info(`📸 Screenshot salvo: ${compressedFilename}`);
      return {
        filename: compressedFilename,
        path: compressedFilepath,
        size: stats.size,
        width: config.PLAYWRIGHT_VIEWPORT_WIDTH,
        height: config.PLAYWRIGHT_VIEWPORT_HEIGHT
      };
    } catch (error) {
      logger.error('Erro ao capturar screenshot:', error);
      throw error;
    }
  }

  async closeSession(sessionId) {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        throw new Error(`Sessão ${sessionId} não encontrada`);
      }

      const page = this.activePages.get(sessionId);
      const context = this.activeContexts.get(sessionId);

      if (page) await page.close();
      if (context) await context.close();
      if (session.browser) await session.browser.close();

      this.activeSessions.delete(sessionId);
      this.activeContexts.delete(sessionId);
      this.activePages.delete(sessionId);

      logger.info(`🔚 Sessão ${sessionId} fechada`);
      return { success: true, sessionId };
    } catch (error) {
      logger.error('Erro ao fechar sessão:', error);
      throw error;
    }
  }

  getActiveSessions() {
    return Array.from(this.activeSessions.values()).map(session => ({
      id: session.id,
      automationId: session.automationId,
      userId: session.userId,
      status: session.status,
      createdAt: session.createdAt
    }));
  }

  async getAllSessions() {
    return this.getActiveSessions();
  }
}

module.exports = new AutomationService();
