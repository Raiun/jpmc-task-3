import { ServerRespond } from './DataStreamer';

export interface Row {
  timestamp: Date,
  abc_price: number,
  def_price: number,
  ratio: number,
  up_bound: number,
  low_bound: number,
  threshold_alert: number | undefined
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    const threshold = 0.05;
    const abcPrice = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const defPrice = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const pRatio = abcPrice / defPrice;
    const upBound = 1 + threshold;
    const lowBound = 1 - threshold;
    
    return {
      timestamp: (serverResponds[0].timestamp > serverResponds[1].timestamp) ?
        serverResponds[0].timestamp : serverResponds[1].timestamp,
      abc_price: abcPrice,
      def_price: defPrice,
      ratio: pRatio,
      up_bound: upBound,
      low_bound: lowBound,
      threshold_alert: (pRatio > upBound || pRatio < lowBound) ? pRatio : undefined
    };
  }
}
