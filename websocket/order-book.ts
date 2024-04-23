

export const useOrderBookWS = () => {
  let STREAM: WebSocket | null = null;

  return {
    STREAM,

    createStream(symbol: string, id: number) {
      const url = new URL('wss://stream.binance.com:9443/ws/' + symbol + '@depth');

      STREAM = new WebSocket(url);

      STREAM.onopen = () => {
        STREAM?.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: [`${symbol}@depth`],
          id,
        }));
      };

      return STREAM;
    },

    closeStream(symbol: string, id: number) {
      if(STREAM === null) {
        return;
      }

      STREAM.send(
        JSON.stringify({
          method: "UNSUBSCRIBE",
          params: [`${symbol}@depth`],
          id,
        }));

      STREAM.close();
      STREAM = null;
     },
  };
};
