import Decimal from "decimal.js";
/**
 * Format a numeric string or bigint to 2 decimal places
 */
export function formatToTwoDecimals(input: string|bigint|number) {
    let decimal;
  
    if (typeof input === "bigint") {
      // Convert bigint to string for Decimal
      decimal = new Decimal(input.toString());
    } else if (typeof input === "string" || typeof input === "number") {
      decimal = new Decimal(input);
    } else {
      throw new Error("Input must be string, number, or bigint");
    }
  
    return decimal.toFixed(2); // returns string, rounded to 2 decimal places
  }