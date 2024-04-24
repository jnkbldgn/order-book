
let STREAM: WebSocket | null = null;

export const useOrderBookWS = () => {

  return {
    restarts: 0,
    idStart: 1,
    idClose: 312,


    createStream(
      symbol: string,
      onMessage: (event: MessageEvent) => void,
    ) {
      const url = new URL('wss://stream.binance.com/stream');

      if(STREAM?.OPEN) {
        STREAM?.send(
          JSON.stringify({
            method: "SUBSCRIBE",
            params: [`${symbol}@depth`],
            id: 1,
          }));
      } else {
        STREAM = new WebSocket(url);

        STREAM.onopen = () => this.openStream(symbol);

        STREAM.onmessage = (event) => onMessage(event);

        STREAM.onerror = (error) => {
          console.log(error);

          if(this.restarts < 5) {
            this.restarts++;
            this.createStream(symbol, onMessage);
          }
        };
      }


      return STREAM;
    },

    openStream(symbol: string) {
      STREAM?.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: [`${symbol}@depth`],
          id: this.idStart,
        }));
     },

    closeStream(symbol: string) {
      STREAM?.send(
        JSON.stringify({
          method: "UNSUBSCRIBE",
          params: [`${symbol}@depth`],
          id: this.idClose,
        })
      );
     },
  };
};
