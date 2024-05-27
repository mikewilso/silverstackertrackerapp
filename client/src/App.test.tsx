import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App', () => {
  test('renders App component', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByTestId('app-container')).toBeInTheDocument();
  });
});