import React from 'react';
import {act} from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ArchiveItem } from './ArchiveItem'; // adjust this import to your file structure
import '@testing-library/jest-dom';

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

describe('ArchiveItem', () => {
  test('renders search input', async () => {
      render(<ArchiveItem />);
      const searchInput = screen.getByPlaceholderText('Search') as HTMLInputElement;
      expect(searchInput).toBeInTheDocument();
  });

  test('updates search input value on change', async () => {
      render(<ArchiveItem />);
      const searchInput = screen.getByPlaceholderText('Search') as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(searchInput.value).toBe('test');
  });

  test('renders table', async () => {
      render(<ArchiveItem />);
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
  });

  test('renders columns', async () => {
      render(<ArchiveItem />);
      const columns = screen.getAllByRole('columnheader');
      expect(columns).toHaveLength(8);
  });
});
