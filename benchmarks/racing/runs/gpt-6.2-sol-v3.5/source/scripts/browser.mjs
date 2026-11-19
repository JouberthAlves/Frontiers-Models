import { createServer } from 'vite';
import { chromium } from 'playwright';

export async function startBrowser() {
  const server = await createServer({
    logLevel: 'error',
    server: { host: '127.0.0.1', port: 0, strictPort: true },
  });
  await server.listen();
  const port = server.httpServer.address().port;
  let browser;
  try {
    browser = await chromium.launch({
      channel: 'chromium',
      args: ['--enable-webgl', '--enable-unsafe-swiftshader'],
    });
    return { server, browser, url: `http://127.0.0.1:${port}/` };
  } catch (error) {
    await server.close();
    throw error;
  }
}
