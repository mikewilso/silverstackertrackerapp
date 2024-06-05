import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import { useFetchMints } from './useFetchMints';

jest.mock('axios');

describe('useFetchMints', () => {
  it('fetches successfully data from an API', async () => {
    const data = [{ mint: 'Test mint' }];
    (axios.get as jest.Mock).mockResolvedValueOnce({ data });

    const { result, waitForNextUpdate } = renderHook(() => useFetchMints());

    await waitForNextUpdate();

    expect(result.current).toEqual([{ value: 'Test mint' }]);
  });

  it('handles error', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Error fetching data'));

    const { result, waitForNextUpdate } = renderHook(() => useFetchMints());

    await waitForNextUpdate();

    expect(result.current).toEqual([{ value: '' }]);
  });
});