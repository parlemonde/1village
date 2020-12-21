import addFormats from "ajv-formats";
import Ajv, { ValidateFunction, DefinedError } from "ajv";

import { AppError, ErrorCode } from "../middlewares/handleErrors";

// eslint-disable-next-line no-console
console.log("-- test -- init Ajv! -- remove this later. This message should appear only once.");
const ajv = new Ajv();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
addFormats(ajv);

export function sendInvalidDataError(validateFunction: ValidateFunction<unknown>): void {
  const errors = validateFunction.errors as DefinedError[];
  let errorMsg = "Invalid data!";
  if (errors.length > 0) {
    errorMsg = errors[0].schemaPath + " " + errors[0].message || errorMsg;
  }
  throw new AppError(errorMsg, ErrorCode.INVALID_DATA);
}

export { ajv };
