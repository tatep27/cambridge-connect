import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

// Test that we can render a simple React component
describe('Component Rendering', () => {
  it('should render without crashing', () => {
    const TestComponent = () => <div>Test</div>;
    const { container } = render(<TestComponent />);
    expect(container).toBeTruthy();
  });
});

