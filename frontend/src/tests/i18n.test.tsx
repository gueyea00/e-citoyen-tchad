import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LanguageProvider, useLanguage } from '../i18n/LanguageContext';

describe('Internationalization System', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('fr-FR');
  });
  it('should toggle RTL direction when switching to Arabic', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>
    });

    // Default to French (LTR)
    expect(result.current.locale).toBe('fr');
    expect(result.current.dir).toBe('ltr');

    // Switch to Arabic
    act(() => {
      result.current.setLocale('ar');
    });

    expect(result.current.locale).toBe('ar');
    expect(result.current.dir).toBe('rtl');
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('should persist language choice in localStorage', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>
    });

    act(() => {
      result.current.setLocale('en');
    });

    expect(localStorage.getItem('locale')).toBe('en');
  });
});
