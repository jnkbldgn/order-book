interface IDepthResponse {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export const useOrderBookApi = () => ({

  async fetchLimits() {
    return [100, 500, 1000];
  },

  async fetchDepth(symbol: string, limit: number) {
    const url = new URL('https://api.binance.com/api/v3/depth');

    url.searchParams.append('symbol', symbol);
    url.searchParams.append('limit', String(limit));

    return $fetch<IDepthResponse>(url.toString());
  },

});
