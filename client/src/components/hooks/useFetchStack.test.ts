import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import { useFetchStack } from './useFetchStack';

jest.mock('axios');

describe('useFetchStack', () => {
  it('fetches successfully data from an API', async () => {
    const data = [{ id: 1, name: 'Test data' }];
    (axios.get as jest.Mock).mockResolvedValueOnce({ data });

    const { result, waitForNextUpdate } = renderHook(() => useFetchStack());

    await waitForNextUpdate();

    expect(result.current).toEqual(data);
  });

  it('handles error', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Error fetching data'));

    const { result, waitForNextUpdate } = renderHook(() => useFetchStack());

    await waitForNextUpdate();
    expect(result.current).toEqual([]);
  });
});