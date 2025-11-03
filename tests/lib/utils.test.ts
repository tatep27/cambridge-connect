import { describe, it, expect } from 'vitest';
import { formatArrayDisplay } from '@/lib/utils';

describe('formatArrayDisplay', () => {
  it('should format a simple array of strings', () => {
    const result = formatArrayDisplay(['space', 'expertise', 'connections']);
    expect(result).toBe('Space • Expertise • Connections');
  });

  it('should handle arrays with underscores', () => {
    const result = formatArrayDisplay(['public_library', 'community_center']);
    expect(result).toBe('Public Library • Community Center');
  });

  it('should handle empty array', () => {
    const result = formatArrayDisplay([]);
    expect(result).toBe('');
  });

  it('should handle single item', () => {
    const result = formatArrayDisplay(['nonprofit']);
    expect(result).toBe('Nonprofit');
  });

  it('should capitalize correctly', () => {
    const result = formatArrayDisplay(['arts_venue', 'grassroots']);
    expect(result).toBe('Arts Venue • Grassroots');
  });
});

