import { time, timeStamp } from 'console';
import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price)/2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price)/2;
    const ratio = priceABC/priceDEF;

    // Calculate the 12-month historical average ratio
    const historicalAverageRatio = 1; // Replace with the actual historical average ratio

    // Define the upper and lower bounds with +/- 5% of the historical average ratio
    const upper_b = historicalAverageRatio * 1.05;
    const lower_b = historicalAverageRatio * 0.95;

    return{
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ? serverResponds[0].timestamp : serverResponds[1].timestamp,
      upper_bound: upper_b,
      lower_bound: lower_b,
      trigger_alert: (ratio > upper_b || ratio < lower_b) ? ratio : undefined,
    };
  }
}
