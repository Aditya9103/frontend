/**
 * phase10.productionBundleAndEnv.test.js
 *
 * Frontend Automated Quality Gate for Phase 10:
 *  - 10.1 Production Distribution Artifacts & Bundle Integrity (dist/)
 *  - 10.2 Production Nginx Configuration & Security Headers (nginx.conf)
 *  - 10.3 Containerization Architecture (Dockerfile & Dockerfile.dev)
 *  - 10.4 Environment Configuration Parity (.env.example)
 */
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

describe('=== Phase 10 Frontend: Production Bundle & Container Audit ===', () => {
  const frontendDir = path.resolve(__dirname, '../../../');

  describe('10.1 Production Distribution Artifacts & Bundle Integrity', () => {
    it('verifies that dist/index.html exists, is non-empty, and mounts root element', () => {
      const indexPath = path.join(frontendDir, 'dist/index.html');
      expect(fs.existsSync(indexPath)).toBe(true);

      const content = fs.readFileSync(indexPath, 'utf8');
      expect(content.length).toBeGreaterThan(100);
      expect(content).toContain('<div id="root">');
      expect(content).toContain('/assets/');
    });

    it('verifies that dist/assets contains compiled CSS stylesheets and JavaScript bundles', () => {
      const assetsDir = path.join(frontendDir, 'dist/assets');
      expect(fs.existsSync(assetsDir)).toBe(true);

      const files = fs.readdirSync(assetsDir);
      const jsFiles = files.filter((f) => f.endsWith('.js'));
      const cssFiles = files.filter((f) => f.endsWith('.css'));

      expect(jsFiles.length).toBeGreaterThan(0);
      expect(cssFiles.length).toBeGreaterThan(0);

      // Verify the main bundle is populated
      const mainBundle = jsFiles.find((f) => f.startsWith('index-'));
      expect(mainBundle).toBeDefined();
      const stats = fs.statSync(path.join(assetsDir, mainBundle));
      expect(stats.size).toBeGreaterThan(10000);
    });
  });

  describe('10.2 Production Nginx Configuration & Security Headers', () => {
    it('verifies nginx.conf contains SPA try_files fallback and security headers', () => {
      const nginxPath = path.join(frontendDir, 'nginx.conf');
      expect(fs.existsSync(nginxPath)).toBe(true);

      const content = fs.readFileSync(nginxPath, 'utf8');
      // SPA fallback
      expect(content).toContain('try_files $uri $uri/ /index.html;');
      // Gzip compression
      expect(content).toContain('gzip on;');
      // Cache headers for static assets
      expect(content).toContain('location /assets/');
      expect(content).toContain('expires 1y;');
      // Security headers
      expect(content).toContain('X-Frame-Options "SAMEORIGIN"');
      expect(content).toContain('X-Content-Type-Options "nosniff"');
    });
  });

  describe('10.3 Containerization Architecture', () => {
    it('verifies production Dockerfile multi-stage build topology', () => {
      const dockerfilePath = path.join(frontendDir, 'Dockerfile');
      expect(fs.existsSync(dockerfilePath)).toBe(true);

      const content = fs.readFileSync(dockerfilePath, 'utf8');
      expect(content).toContain('FROM node:20-alpine AS builder');
      expect(content).toContain('RUN npm run build');
      expect(content).toContain('FROM nginx:1.27-alpine');
      expect(content).toContain('COPY --from=builder /app/dist /usr/share/nginx/html');
      expect(content).toContain('EXPOSE 80');
      expect(content).toContain('CMD ["nginx", "-g", "daemon off;"]');
    });

    it('verifies development Dockerfile.dev host binding configuration', () => {
      const devDockerfilePath = path.join(frontendDir, 'Dockerfile.dev');
      expect(fs.existsSync(devDockerfilePath)).toBe(true);

      const content = fs.readFileSync(devDockerfilePath, 'utf8');
      expect(content).toContain('FROM node:20-alpine');
      expect(content).toContain('EXPOSE 5173');
      expect(content).toContain('--host');
      expect(content).toContain('0.0.0.0');
    });
  });

  describe('10.4 Environment Configuration Parity', () => {
    it('verifies .env.example defines all required Vite client environment variables', () => {
      const envPath = path.join(frontendDir, '.env.example');
      expect(fs.existsSync(envPath)).toBe(true);

      const content = fs.readFileSync(envPath, 'utf8');
      expect(content).toContain('VITE_API_BASE_URL=');
      expect(content).toContain('VITE_SOCKET_URL=');
      expect(content).toContain('VITE_RAZORPAY_KEY_ID=');
      expect(content).toContain('VITE_GOOGLE_CLIENT_ID=');
    });
  });
});
