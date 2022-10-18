import useSWR from "swr";

/**
 * Re-usable SWR api implementation.
 *
 * @param {string} url
 * @param {object} params
 * @returns object
 */
function useApi<DATA>(url: string, params: any) {
  const usp = new URLSearchParams(params);

  // Create a stable key for SWR
  usp.sort();
  const qs = usp.toString();

  const { data, error } = useSWR<DATA>(`${url}?${qs}`);

  return {
    loading: !error && !data,
    data,
    error,
  };
}

export default useApi;
