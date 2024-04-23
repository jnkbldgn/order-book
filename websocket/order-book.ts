
let STREAM: WebSocket | null = null;

export const useOrderBookWS = () => {

  return {

    createStream(symbol: string, id: number, updateDepth: (id: number, asks: string[][], bids: string[][]) => void) {
      const url = new URL('wss://stream.binance.com:9443/ws/' + symbol + '@depth');

      STREAM = new WebSocket(url);

      STREAM.onopen = () => {
        STREAM?.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: [`${symbol}@depth`],
          id: 1,
        }));
      };

      STREAM.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if(data.id === 312) {
          STREAM?.close(1001);
          STREAM = null;
        }

        if(data.U > id || data.u < id) {
          return;
        }

        const asks = data.a?.filter((it: string[]) => Number(it[1]) > 0) ?? [];
        const bids = data.b?.filter((it: string[]) => Number(it[1]) > 0) ?? [];

        updateDepth(data.u, asks, bids);
      };

      STREAM.onerror = (error) => {
        console.log(error);
      };

      return STREAM;
    },

    closeStream(symbol: string) {
      STREAM?.send(
        JSON.stringify({
          method: "UNSUBSCRIBE",
          params: [`${symbol}@depth`],
          id: 312,
        })
      );
     },
  };
};
