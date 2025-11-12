import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('Temp App', () => {
  it('renders the Temp placeholder heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /temp ui/i })).toBeInTheDocument();
  });
});

