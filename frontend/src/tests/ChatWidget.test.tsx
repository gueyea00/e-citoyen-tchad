import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChatWidget } from '../components/chatbot/ChatWidget';
import { LanguageProvider } from '../i18n/LanguageContext';

describe('ChatWidget Component', () => {
  it('should open the chat modal on click', () => {
    render(
      <LanguageProvider>
        <ChatWidget />
      </LanguageProvider>
    );

    // Initial state: Only the toggle button is shown (aria-label)
    const toggleButton = screen.getByRole('button', { name: /Open chat/i });
    expect(toggleButton).toBeInTheDocument();

    // Opening it
    fireEvent.click(toggleButton);

    // Expect the input to be visible (testing translation context fallback)
    const inputField = screen.getByRole('textbox');
    expect(inputField).toBeInTheDocument();
  });
});
