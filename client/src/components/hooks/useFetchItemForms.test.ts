import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import { useFetchItemForms } from './useFetchItemForms';

jest.mock('axios');

describe('useFetchItemForms', () => {
  it('fetches successfully data from an API', async () => {
    const data = [{ id: 1, itemformvalue: 'Test value', itemformtype: 'Test type' }];
    (axios.get as jest.Mock).mockResolvedValueOnce({ data });

    const { result, waitForNextUpdate } = renderHook(() => useFetchItemForms(0));

    await waitForNextUpdate();

    expect(result.current).toEqual(data);
  });

  it('handles error', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Error fetching data'));

    const { result, waitForNextUpdate } = renderHook(() => useFetchItemForms(0));

    await waitForNextUpdate();

    expect(result.current).toEqual([{ id: 0, itemformvalue: '', itemformtype: '' }]);
  });
});