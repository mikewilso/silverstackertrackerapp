import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import { useFetchPurities } from './useFetchPurities';

jest.mock('axios');

describe('useFetchPurities', () => {
  it('fetches successfully data from an API', async () => {
    const data = [{ id: 1, name: 'Test data', purity: '1' }];
    (axios.get as jest.Mock).mockResolvedValueOnce({ data });

    const { result, waitForNextUpdate } = renderHook(() => useFetchPurities());

    await waitForNextUpdate();

    expect(result.current).toEqual(data);
  });

  it('handles error', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Error fetching data'));

    const { result, waitForNextUpdate } = renderHook(() => useFetchPurities());

    await waitForNextUpdate();

    expect(result.current).toEqual([{ id: 0, name: '', purity: '' }]);
  });
});