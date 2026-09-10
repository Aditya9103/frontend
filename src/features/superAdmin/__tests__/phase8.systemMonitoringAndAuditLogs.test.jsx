/**
 * phase8.systemMonitoringAndAuditLogs.test.jsx
 *
 * Frontend Vitest Suite for Phase 8:
 *  - 8.1 SystemMonitoring Component: Telemetry & Resource Metric Rendering
 *  - 8.2 ActivityLogs Component: Classification, Filtering & Search
 *  - 8.3 Resilient Response Envelope Handling (DEF-08-005)
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import SystemMonitoring from '../pages/SystemMonitoring';
import ActivityLogs from '../pages/ActivityLogs';
import superAdminService from '../../../core/services/superAdmin.service';

vi.mock('../../../core/services/superAdmin.service', () => ({
  default: {
    getSystemHealth: vi.fn(),
    getActivityLogs: vi.fn(),
    requestLogDeletion: vi.fn(),
    executeLogDeletion: vi.fn(),
  },
}));

vi.mock('../components/SuperAdminSidebar', () => ({
  default: () => <div data-testid="superadmin-sidebar">Sidebar</div>,
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

describe('=== Phase 8 Frontend: System Monitoring & Activity Log Audits ===', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('8.1 SystemMonitoring Component', () => {
    const mockHealth = {
      uptime: 7200, // 2.00 hours
      dbState: 'Connected',
      cpu: {
        model: 'Apple M1 Max',
        cores: 10,
      },
      memory: {
        total: 16 * 1024 * 1024 * 1024,
        free: 8 * 1024 * 1024 * 1024,
        appAllocated: 512 * 1024 * 1024,
      },
    };

    it('renders system health metrics from standard data envelope (DEF-08-005)', async () => {
      superAdminService.getSystemHealth.mockResolvedValueOnce({
        data: {
          success: true,
          data: { health: mockHealth },
        },
      });

      render(
        <MemoryRouter>
          <SystemMonitoring />
        </MemoryRouter>
      );

      // Verify loading state first
      expect(screen.getByText(/Loading System Health/i)).toBeInTheDocument();

      // Wait for health metrics to populate
      await waitFor(() => {
        expect(screen.getByText(/2.00 hours/i)).toBeInTheDocument();
      });

      expect(screen.getByText('Connected')).toBeInTheDocument();
      expect(screen.getByText('Apple M1 Max')).toBeInTheDocument();
      expect(screen.getByText(/10 Cores/i)).toBeInTheDocument();
      expect(screen.getByText('Total Memory')).toBeInTheDocument();
    });

    it('renders system health metrics from legacy envelope format defensively', async () => {
      superAdminService.getSystemHealth.mockResolvedValueOnce({
        data: {
          success: true,
          health: mockHealth,
        },
      });

      render(
        <MemoryRouter>
          <SystemMonitoring />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/2.00 hours/i)).toBeInTheDocument();
      });
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
  });

  describe('8.2 ActivityLogs Component Filtering & Classification', () => {
    const mockLogs = [
      {
        _id: 'log-1',
        action: 'LOGIN',
        module: 'AUTH',
        description: 'User logged in via email',
        ip: '127.0.0.1',
        createdAt: '2026-09-10T10:00:00.000Z',
        userId: { fullName: 'Student User', email: 'student@example.com' },
      },
      {
        _id: 'log-2',
        action: 'DELETE',
        module: 'COURSES',
        description: 'Deleted obsolete course',
        ip: '192.168.1.1',
        createdAt: '2026-09-10T10:15:00.000Z',
        userId: { fullName: 'Admin Staff', email: 'admin@example.com' },
      },
      {
        _id: 'log-3',
        action: 'ROLE_UPDATE',
        module: 'SUPERADMIN',
        description: 'Promoted user to ADMIN',
        ip: '192.168.1.1',
        createdAt: '2026-09-10T10:30:00.000Z',
        userId: { fullName: 'Super Admin', email: 'superadmin@example.com' },
      },
    ];

    it('renders engagement logs by default and switches to audit logs tab', async () => {
      superAdminService.getActivityLogs.mockResolvedValueOnce({
        data: {
          success: true,
          data: { logs: mockLogs },
        },
      });

      render(
        <MemoryRouter>
          <ActivityLogs />
        </MemoryRouter>
      );

      // In engagement tab by default, LOGIN should be visible
      await waitFor(() => {
        expect(screen.getByText('LOGIN')).toBeInTheDocument();
      });
      expect(screen.getByText('User logged in via email')).toBeInTheDocument();

      // Switch to Audit tab
      const auditTabButton = screen.getByRole('button', { name: /audit/i });
      fireEvent.click(auditTabButton);

      // DELETE and ROLE_UPDATE should be visible in audit tab
      await waitFor(() => {
        expect(screen.getByText('DELETE')).toBeInTheDocument();
      });
      expect(screen.getByText('Deleted obsolete course')).toBeInTheDocument();
    });

    it('filters activity logs by search query keyword', async () => {
      superAdminService.getActivityLogs.mockResolvedValueOnce({
        data: {
          success: true,
          data: { logs: mockLogs },
        },
      });

      render(
        <MemoryRouter>
          <ActivityLogs />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('LOGIN')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'nonexistent-action' } });

      // No matching rows should remain in table
      expect(screen.queryByText('LOGIN')).not.toBeInTheDocument();
    });
  });
});
