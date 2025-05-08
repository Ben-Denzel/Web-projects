import { TestBed } from '@angular/core/testing';
import { HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenInterceptor } from './token.interceptor';

describe('TokenInterceptor', () => {
  let interceptor: TokenInterceptor;

  // ✅ Mock localStorage before each test
  beforeEach(() => {
    // Setup Angular test module (even if empty)
    TestBed.configureTestingModule({});

    interceptor = new TokenInterceptor();

    // Mock localStorage
    const mockLocalStorage = (() => {
      let store: { [key: string]: string } = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; }
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header if token exists', () => {
    const token = 'dummy-token';
    localStorage.setItem('token', token);

    const req = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: (request: HttpRequest<any>) => {
        expect(request.headers.has('Authorization')).toBeTrue();
        expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`);
        return { subscribe: () => {} } as any; // dummy return
      }
    };

    interceptor.intercept(req, next);
  });

  it('should not add Authorization header if token does not exist', () => {
    localStorage.removeItem('token');

    const req = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: (request: HttpRequest<any>) => {
        expect(request.headers.has('Authorization')).toBeFalse();
        return { subscribe: () => {} } as any; // dummy return
      }
    };

    interceptor.intercept(req, next);
  });
});
