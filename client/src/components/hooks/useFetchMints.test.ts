import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import { useFetchPurchasePlaces } from './useFetchPurchasePlaces';

jest.mock('axios');

describe('useFetchPurchasePlaces', () => {
  it('fetches data successfully from an API', async () => {
    const data = [{ purchasedfrom: 'Test place' }];
    (axios.get as jest.Mock).mockResolvedValueOnce({ data });

    const { result, waitForNextUpdate } = renderHook(() => useFetchPurchasePlaces());

    await waitForNextUpdate();

    expect(result.current).toEqual([{ value: 'Test place' }]);
  });

  it('handles error', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Error fetching data'));

    const { result, waitForNextUpdate } = renderHook(() => useFetchPurchasePlaces());

    await waitForNextUpdate();

    expect(result.current).toEqual([{ value: '' }]);
  });
});