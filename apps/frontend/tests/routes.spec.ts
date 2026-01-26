import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

type RouteExpectation = {
  path: string;
  expectedStatus: number;
  expectedH1?: string;
};

function normalizeRoute(p: string): string {
  if (!p.startsWith('/')) return `/${p}`;
  return p;
}

async function loadRoutesFromLlm(): Promise<RouteExpectation[]> {
  const llmPath = path.resolve(process.cwd(), 'public', 'llm.txt');
  const content = await fs.readFile(llmPath, 'utf8');
  const lines = content.split(/\r?\n/);

  const routes = new Map<string, RouteExpectation>();

  let currentSectionRoute: string | null = null;

  const addRoute = (routePath: string, patch?: Partial<RouteExpectation>) => {
    const normalized = normalizeRoute(routePath);
    const existing = routes.get(normalized);
    const expectedStatus =
      normalized === '/__does_not_exist__' ||
      normalized === '/personvern' ||
      normalized === '/tilgjengelighet'
        ? 404
        : 200;

    const next: RouteExpectation = {
      path: normalized,
      expectedStatus,
      ...(existing ?? {}),
      ...(patch ?? {}),
    };

    routes.set(normalized, next);
  };

  for (const raw of lines) {
    const line = raw.trim();

    // Route section headers: "### /foo"
    const sectionMatch = /^###\s+(\/\S*)\s*$/.exec(line);
    if (sectionMatch) {
      currentSectionRoute = sectionMatch[1];
      // Do not add dynamic routes like /foo/[slug] to the concrete test list
      if (!currentSectionRoute.includes('[')) {
        addRoute(currentSectionRoute);
      }
      continue;
    }

    // Capture expected H1 when inside a section
    if (currentSectionRoute && !currentSectionRoute.includes('[')) {
      const h1Match = /^-\s*H1:\s*“(.+)”\s*$/.exec(line);
      if (h1Match) {
        addRoute(currentSectionRoute, { expectedH1: h1Match[1] });
        continue;
      }
    }

    // Capture example routes under "Eksempelruter" lists
    const exampleRouteMatch = /^-\s*(\/[^\s]+)\s*$/.exec(line);
    if (exampleRouteMatch) {
      const maybeRoute = exampleRouteMatch[1];
      if (maybeRoute.startsWith('/') && !maybeRoute.includes('[')) {
        addRoute(maybeRoute);
      }
    }
  }

  // Ensure 404 test route is always included
  addRoute('/__does_not_exist__');

  return Array.from(routes.values());
}

test.describe('Route smoke tests (from public/llm.txt)', () => {
  test('all documented routes respond as expected', async ({ page, baseURL }) => {
    expect(baseURL, 'baseURL must be set (e.g. http://localhost:4321)').toBeTruthy();

    const routes = await loadRoutesFromLlm();
    expect(routes.length).toBeGreaterThan(0);

    const failures: Array<{ path: string; status: number | null; h1: string | null; expectedH1?: string }> = [];

    for (const route of routes) {
      const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      const status = response ? response.status() : null;

      if (status !== route.expectedStatus) {
        failures.push({ path: route.path, status, h1: null, expectedH1: route.expectedH1 });
        continue;
      }

      if (route.expectedStatus === 200 && route.expectedH1) {
        const h1Locator = page.locator('h1').first();
        const h1Text = (await h1Locator.count()) ? (await h1Locator.innerText()).trim() : null;
        if (h1Text !== route.expectedH1) {
          failures.push({ path: route.path, status, h1: h1Text, expectedH1: route.expectedH1 });
        }
      }
    }

    expect(failures, `Route smoke failures:\n${JSON.stringify(failures, null, 2)}`).toEqual([]);
  });
});
