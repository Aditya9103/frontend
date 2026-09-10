/**
 * phase10.blogsAndDashboardAudits.test.jsx — Phase 10 Frontend Audits & Edge Cases
 *
 * Scope:
 *  - 10.1 Blog Component (Category filtering, Admin actions, SEO slug links)
 *  - 10.2 BlogDetails Component (Content rendering, DOMPurify safety, Document title update)
 *  - 10.3 Contact Component (Input validation, Email regex guard, Submission state)
 *  - 10.4 LearnerDashboard Component (Metrics rendering, Streak, Deadlines, Section Mastery)
 */

import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import blogService from '../../../core/services/blog.service';
import publicService from '../../../core/services/public.service';
import authReducer from '../../auth/redux/AuthSlice';
import notificationReducer from '../../notifications/redux/NotificationSlice';
import dashboardReducer from '../../superAdmin/redux/DashboardSlice';
import LearnerDashboard from '../../users/pages/LearnerDashboard';
import Blog from '../pages/Blog';
import BlogDetails from '../pages/BlogDetails';
import Contact from '../pages/Contact';

// Mock services
vi.mock('../../../core/services/blog.service', () => ({
  default: {
    getBlogs: vi.fn(),
    getBlogDetails: vi.fn(),
    createBlog: vi.fn(),
  },
}));

vi.mock('../../../core/services/public.service', () => ({
  default: {
    contactUs: vi.fn(),
  },
}));

// Mock react-hot-toast
const { mockToast } = vi.hoisted(() => {
  const t = {
    success: vi.fn(),
    error: vi.fn(),
    promise: vi.fn((p) => p),
  };
  return { mockToast: t };
});

vi.mock('react-hot-toast', () => ({
  default: mockToast,
  toast: mockToast,
}));

describe('=== Phase 10 Frontend: Public Modules & Learner Dashboard ===', () => {
  const mockBlogs = [
    {
      _id: 'blog1',
      title: 'Deep Dive into React 19',
      slug: 'deep-dive-into-react-19',
      excerpt: 'Exploring React server actions and compilers.',
      category: 'Frontend',
      author: 'Tech Lead',
      createdAt: '2026-03-01T10:00:00.000Z',
      tags: ['react', 'javascript'],
    },
    {
      _id: 'blog2',
      title: 'Zero Trust Cloud Architecture',
      slug: 'zero-trust-cloud-architecture',
      excerpt: 'Securing Kubernetes clusters in production.',
      category: 'Security',
      author: 'Security Architect',
      createdAt: '2026-03-05T12:00:00.000Z',
      tags: ['cloud', 'kubernetes'],
    },
  ];

  const createTestStore = (initialAuthState = {}, initialDashboardState = {}) => {
    return configureStore({
      reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        notifications: notificationReducer,
      },
      preloadedState: {
        auth: {
          isLoggedIn: false,
          role: 'USER',
          data: null,
          token: null,
          authCheckComplete: true,
          ...initialAuthState,
        },
        dashboard: {
          learnerData: null,
          loading: false,
          error: null,
          ...initialDashboardState,
        },
        notifications: {
          list: [],
          unreadCount: 0,
          loading: false,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── 10.1 Blog Component ───────────────────────────────────────────────────
  describe('10.1 Blog Catalog & Category Filtering', () => {
    it('renders blog list, category filter badges, and filters articles when category clicked', async () => {
      blogService.getBlogs.mockResolvedValueOnce({
        data: { blogs: mockBlogs },
      });

      const store = createTestStore({ isLoggedIn: false, role: 'USER' });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Blog />
          </MemoryRouter>
        </Provider>
      );

      // Verify articles load
      await waitFor(() => {
        expect(screen.getByText('Deep Dive into React 19')).toBeInTheDocument();
        expect(screen.getByText('Zero Trust Cloud Architecture')).toBeInTheDocument();
      });

      // Verify categories
      expect(screen.getByRole('button', { name: 'Frontend' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Security' })).toBeInTheDocument();

      // Click "Frontend" filter
      fireEvent.click(screen.getByRole('button', { name: 'Frontend' }));

      // "Deep Dive into React 19" should remain, "Zero Trust Cloud Architecture" should be filtered out
      expect(screen.getByText('Deep Dive into React 19')).toBeInTheDocument();
      expect(screen.queryByText('Zero Trust Cloud Architecture')).not.toBeInTheDocument();

      // Click "All" filter to restore
      fireEvent.click(screen.getByRole('button', { name: 'All' }));
      expect(screen.getByText('Zero Trust Cloud Architecture')).toBeInTheDocument();
    });

    it('shows "Publish Article" action for ADMIN and hides it for regular USER', async () => {
      blogService.getBlogs.mockResolvedValueOnce({ data: { blogs: [] } });

      // 1. Regular User
      const userStore = createTestStore({ isLoggedIn: true, role: 'USER' });
      const { unmount } = render(
        <Provider store={userStore}>
          <MemoryRouter>
            <Blog />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.queryByText(/Publish Article/i)).not.toBeInTheDocument();
      unmount();

      // 2. Admin User
      blogService.getBlogs.mockResolvedValueOnce({ data: { blogs: [] } });
      const adminStore = createTestStore({ isLoggedIn: true, role: 'ADMIN' });
      render(
        <Provider store={adminStore}>
          <MemoryRouter>
            <Blog />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText(/Publish Article/i)).toBeInTheDocument();
    });
  });

  // ─── 10.2 BlogDetails Component ────────────────────────────────────────────
  describe('10.2 BlogDetails & Native Document SEO', () => {
    it('fetches blog details by slug, updates document title, and renders content safely', async () => {
      const detailedBlog = {
        _id: 'blog1',
        title: 'Deep Dive into React 19',
        slug: 'deep-dive-into-react-19',
        metaTitle: 'React 19 Deep Dive Tutorial',
        metaDescription: 'Complete technical breakdown of React 19 compiler.',
        content: '<p>React 19 introduces automatic memoization and Actions.</p>',
        category: 'Frontend',
        author: 'Tech Lead',
        createdAt: '2026-03-01T10:00:00.000Z',
        tags: ['react', 'javascript'],
      };

      blogService.getBlogDetails.mockResolvedValueOnce({
        data: { blog: detailedBlog },
      });

      const store = createTestStore();

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/blog/deep-dive-into-react-19']}>
            <Routes>
              <Route path="/blog/:id" element={<BlogDetails />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByText('Deep Dive into React 19')).toBeInTheDocument();
        expect(screen.getByText('Tech Lead')).toBeInTheDocument();
        expect(screen.getByText(/React 19 introduces automatic memoization/i)).toBeInTheDocument();
      });

      // Verify document title was updated for SEO
      expect(document.title).toContain('React 19 Deep Dive Tutorial');
    });
  });

  // ─── 10.3 Contact Component ────────────────────────────────────────────────
  describe('10.3 Contact Form & Validation Guardrails', () => {
    it('prevents submission on invalid email and dispatches contactUs on valid input', async () => {
      const toast = await import('react-hot-toast');
      publicService.contactUs.mockResolvedValueOnce({ data: { success: true } });

      const store = createTestStore();

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Contact />
          </MemoryRouter>
        </Provider>
      );

      const nameInput = screen.getByPlaceholderText(/Enter your name/i);
      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      const messageInput = screen.getByPlaceholderText(/Enter your message/i);
      const submitBtn = screen.getByRole('button', { name: /Send Message/i });

      // 1. Submit with empty fields
      fireEvent.click(submitBtn);
      expect(mockToast.error).toHaveBeenCalledWith('All fields are mandatory');

      // 2. Submit with invalid email format
      fireEvent.change(nameInput, { target: { value: 'Alex' } });
      fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
      fireEvent.change(messageInput, { target: { value: 'Hello Learnify team' } });
      fireEvent.click(submitBtn);

      expect(mockToast.error).toHaveBeenCalledWith('Invalid email');

      // 3. Submit with valid inputs
      fireEvent.change(emailInput, { target: { value: 'alex@enterprise.com' } });
      fireEvent.click(submitBtn);

      expect(publicService.contactUs).toHaveBeenCalledWith({
        name: 'Alex',
        email: 'alex@enterprise.com',
        message: 'Hello Learnify team',
      });
    });
  });

  // ─── 10.4 Learner Dashboard Component ──────────────────────────────────────
  describe('10.4 Learner Dashboard Data Presentation', () => {
    it('renders continue learning, upcoming deadlines, and section mastery', async () => {
      const learnerData = {
        continueLearning: {
          courseId: {
            _id: 'c1',
            title: 'Modern Distributed Systems',
            thumbnail: { secure_url: 'https://cdn.example.com/thumb.jpg' },
          },
          lectureId: 'l1',
          timestamp: 300,
        },
        upcomingDeadlines: [
          {
            title: 'Quiz 1: Distributed Raft Consensus',
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            type: 'QUIZ',
            courseTitle: 'Modern Distributed Systems',
            courseId: 'c1',
          },
        ],
        overallProgress: 75,
        streak: { count: 5, lastActiveDate: new Date().toISOString() },
        estimatedCompletionTime: 3600,
        sectionMastery: [
          { title: 'Core Architecture', mastery: 85 },
        ],
      };

      const store = createTestStore(
        { isLoggedIn: true, role: 'USER' },
        { learnerData, loading: false }
      );

      render(
        <Provider store={store}>
          <MemoryRouter>
            <LearnerDashboard />
          </MemoryRouter>
        </Provider>
      );

      // Verify metrics rendered
      expect(screen.getAllByText('Modern Distributed Systems').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Quiz 1: Distributed Raft Consensus')).toBeInTheDocument();
      expect(screen.getByText(/Core Architecture/i)).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });
});
