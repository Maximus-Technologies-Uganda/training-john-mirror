/**
 * Tests for StopwatchControls Component - Stop Button
 * 
 * Tests for User Story 3: Stop and Reset
 * Verifies Stop button behavior and state management
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import { StopwatchControls } from '@/components/StopwatchControls';

describe('StopwatchControls - Stop Button (T036)', () => {
  describe('Stop button visibility and state', () => {
    it('should render Stop button when onStop callback provided', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      expect(screen.getByTestId('button-stop')).toBeInTheDocument();
    });

    it('should not render Stop button when onStop callback not provided', () => {
      const mockOnStart = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
        />
      );

      expect(screen.queryByTestId('button-stop')).not.toBeInTheDocument();
    });

    it('should be enabled when stopwatch is running', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      expect(screen.getByTestId('button-stop')).not.toBeDisabled();
    });

    it('should be disabled when stopwatch is not running', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={false}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      expect(screen.getByTestId('button-stop')).toBeDisabled();
    });
  });

  describe('Stop button interaction', () => {
    it('should call onStop callback when clicked', async () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      await userEvent.click(stopButton);

      expect(mockOnStop).toHaveBeenCalledOnce();
    });

    it('should call onStop when Enter key pressed', async () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      stopButton.focus();
      fireEvent.keyDown(stopButton, { key: 'Enter' });

      expect(mockOnStop).toHaveBeenCalledOnce();
    });

    it('should call onStop when Space key pressed', async () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      stopButton.focus();
      fireEvent.keyDown(stopButton, { key: ' ' });

      expect(mockOnStop).toHaveBeenCalledOnce();
    });

    it('should not call onStop when disabled and clicked', async () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={false}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      await userEvent.click(stopButton);

      expect(mockOnStop).not.toHaveBeenCalled();
    });
  });

  describe('Stop button accessibility', () => {
    it('should have aria-label describing stop action', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      expect(screen.getByTestId('button-stop')).toHaveAttribute('aria-label');
      expect(screen.getByTestId('button-stop')).toHaveAttribute('aria-label', 'Stop stopwatch');
    });

    it('should be keyboard focusable', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      stopButton.focus();

      expect(stopButton).toHaveFocus();
    });
  });

  describe('Stop button styling', () => {
    it('should have red color scheme', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      const style = window.getComputedStyle(stopButton);

      // Should have red background or similar red color
      expect(stopButton).toHaveStyle({
        backgroundColor: '#f44336',
      });
    });

    it('should be visually disabled with opacity when not running', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={false}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      
      // Should have reduced opacity when disabled
      expect(stopButton).toHaveStyle({
        opacity: '0.6',
      });
    });
  });
});

/**
 * T044: Component test for "Cannot lap before starting" error
 * 
 * Tests that attempting to lap without starting first triggers an error
 * and that the error is displayed to the user
 */
describe('StopwatchControls - Cannot Lap Before Starting Error (T044)', () => {
  describe('Lap button validation', () => {
    it('should be disabled when stopwatch is not running', () => {
      const mockOnStart = vi.fn();
      const mockOnLap = vi.fn();

      render(
        <StopwatchControls
          isRunning={false}
          onStart={mockOnStart}
          onLap={mockOnLap}
        />
      );

      const lapButton = screen.getByTestId('button-lap');
      expect(lapButton).toBeDisabled();
    });

    it('should be enabled when stopwatch is running', () => {
      const mockOnStart = vi.fn();
      const mockOnLap = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onLap={mockOnLap}
        />
      );

      const lapButton = screen.getByTestId('button-lap');
      expect(lapButton).not.toBeDisabled();
    });

    it('should not call onLap when disabled and clicked', () => {
      const mockOnStart = vi.fn();
      const mockOnLap = vi.fn();

      render(
        <StopwatchControls
          isRunning={false}
          onStart={mockOnStart}
          onLap={mockOnLap}
        />
      );

      const lapButton = screen.getByTestId('button-lap');
      fireEvent.click(lapButton);

      expect(mockOnLap).not.toHaveBeenCalled();
    });

    it('should show visual disabled state when stopwatch not running', () => {
      const mockOnStart = vi.fn();
      const mockOnLap = vi.fn();

      render(
        <StopwatchControls
          isRunning={false}
          onStart={mockOnStart}
          onLap={mockOnLap}
        />
      );

      const lapButton = screen.getByTestId('button-lap');
      
      // Should have reduced opacity when disabled
      expect(lapButton).toHaveStyle({
        opacity: '0.6',
      });
      
      // Cursor should be 'not-allowed'
      expect(lapButton).toHaveStyle({
        cursor: 'not-allowed',
      });
    });

    it('should have orange color scheme', () => {
      const mockOnStart = vi.fn();
      const mockOnLap = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onLap={mockOnLap}
        />
      );

      const lapButton = screen.getByTestId('button-lap');
      
      expect(lapButton).toHaveStyle({
        backgroundColor: '#FF9800',
      });
    });

    it('should have ARIA label indicating record action', () => {
      const mockOnStart = vi.fn();
      const mockOnLap = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onLap={mockOnLap}
        />
      );

      const lapButton = screen.getByTestId('button-lap');
      
      expect(lapButton).toHaveAttribute('aria-label', 'Record lap');
    });

    it('should respond to keyboard when enabled', () => {
      const mockOnStart = vi.fn();
      const mockOnLap = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onLap={mockOnLap}
        />
      );

      const lapButton = screen.getByTestId('button-lap');
      
      // Test Enter key
      fireEvent.keyDown(lapButton, { key: 'Enter', code: 'Enter' });
      expect(mockOnLap).toHaveBeenCalledTimes(1);
      
      // Test Space key
      fireEvent.keyDown(lapButton, { key: ' ', code: 'Space' });
      expect(mockOnLap).toHaveBeenCalledTimes(2);
    });

    it('should not respond to keyboard when disabled', () => {
      const mockOnStart = vi.fn();
      const mockOnLap = vi.fn();

      render(
        <StopwatchControls
          isRunning={false}
          onStart={mockOnStart}
          onLap={mockOnLap}
        />
      );

      const lapButton = screen.getByTestId('button-lap');
      
      // Test that disabled buttons don't trigger on keyboard
      fireEvent.keyDown(lapButton, { key: 'Enter', code: 'Enter' });
      expect(mockOnLap).not.toHaveBeenCalled();
    });

    it('should be keyboard focusable', () => {
      const mockOnStart = vi.fn();
      const mockOnLap = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onLap={mockOnLap}
        />
      );

      const lapButton = screen.getByTestId('button-lap');
      lapButton.focus();

      expect(lapButton).toHaveFocus();
    });
  });
});

/**
 * T045: Component test for "Stopwatch is already stopped" error
 * 
 * Tests that attempting to stop an already stopped stopwatch is prevented
 * and that the Stop button is properly disabled when not running
 */
describe('StopwatchControls - Stopwatch Already Stopped Error (T045)', () => {
  describe('Stop button validation', () => {
    it('should be disabled when stopwatch is not running (idle)', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={false}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      expect(stopButton).toBeDisabled();
    });

    it('should be enabled when stopwatch is running', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      expect(stopButton).not.toBeDisabled();
    });

    it('should not call onStop when already stopped (disabled and clicked)', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={false}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      fireEvent.click(stopButton);

      expect(mockOnStop).not.toHaveBeenCalled();
    });

    it('should show visual disabled state when stopwatch not running', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={false}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      
      // Should have reduced opacity when disabled
      expect(stopButton).toHaveStyle({
        opacity: '0.6',
      });
      
      // Cursor should be 'not-allowed'
      expect(stopButton).toHaveStyle({
        cursor: 'not-allowed',
      });
    });

    it('should have red color scheme (danger action)', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      
      expect(stopButton).toHaveStyle({
        backgroundColor: '#f44336',
      });
    });

    it('should have ARIA label indicating stop action', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      
      expect(stopButton).toHaveAttribute('aria-label', 'Stop stopwatch');
    });

    it('should respond to keyboard when running', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      
      // Test Enter key
      fireEvent.keyDown(stopButton, { key: 'Enter', code: 'Enter' });
      expect(mockOnStop).toHaveBeenCalledTimes(1);
      
      // Test Space key
      fireEvent.keyDown(stopButton, { key: ' ', code: 'Space' });
      expect(mockOnStop).toHaveBeenCalledTimes(2);
    });

    it('should not respond to keyboard when stopped', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={false}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      
      // Test that disabled buttons don't trigger on keyboard
      fireEvent.keyDown(stopButton, { key: 'Enter', code: 'Enter' });
      expect(mockOnStop).not.toHaveBeenCalled();
      
      fireEvent.keyDown(stopButton, { key: ' ', code: 'Space' });
      expect(mockOnStop).not.toHaveBeenCalled();
    });

    it('should be keyboard focusable', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      stopButton.focus();

      expect(stopButton).toHaveFocus();
    });

    it('should transition from enabled to disabled when stopwatch transitions from running to stopped', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      const { rerender } = render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      expect(stopButton).not.toBeDisabled();
      expect(stopButton).toHaveStyle({ opacity: '1' });

      // Simulate stop by re-rendering with isRunning=false
      rerender(
        <StopwatchControls
          isRunning={false}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      // Button should now be disabled
      expect(stopButton).toBeDisabled();
      expect(stopButton).toHaveStyle({ opacity: '0.6' });
    });

    it('should show dark red hover effect when enabled', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={true}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      
      // Simulate mouse enter
      fireEvent.mouseEnter(stopButton);
      expect(stopButton).toHaveStyle({
        backgroundColor: '#da190b',
      });
      
      // Simulate mouse leave
      fireEvent.mouseLeave(stopButton);
      expect(stopButton).toHaveStyle({
        backgroundColor: '#f44336',
      });
    });

    it('should not show hover effect when disabled', () => {
      const mockOnStart = vi.fn();
      const mockOnStop = vi.fn();

      render(
        <StopwatchControls
          isRunning={false}
          onStart={mockOnStart}
          onStop={mockOnStop}
        />
      );

      const stopButton = screen.getByTestId('button-stop');
      
      // Simulate mouse enter - should NOT change color because disabled
      fireEvent.mouseEnter(stopButton);
      expect(stopButton).toHaveStyle({
        backgroundColor: '#f44336', // Should remain the same
      });
    });
  });
});
