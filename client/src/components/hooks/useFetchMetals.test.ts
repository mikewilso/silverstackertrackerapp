import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import { useFetchMetals } from './useFetchMetals';

jest.mock('axios');

describe('useFetchMetals', () => {
  it('fetches successfully data from an API', async () => {
    const data = [{ id: 1, metalvalue: 'Test value', metaltype: 'Test type' }];
    (axios.get as jest.Mock).mockResolvedValueOnce({ data });

    const { result, waitForNextUpdate } = renderHook(() => useFetchMetals(0));

    await waitForNextUpdate();

    expect(result.current).toEqual(data);
  });

  it('handles error', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Error fetching data'));

    const { result, waitForNextUpdate } = renderHook(() => useFetchMetals(0));

    await waitForNextUpdate();

    expect(result.current).toEqual([{ id: 0, metalvalue: '', metaltype: '' }]);
  });
});