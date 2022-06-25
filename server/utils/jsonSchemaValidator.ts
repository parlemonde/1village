import type { ValidateFunction, DefinedError } from 'ajv';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { AppError, ErrorCode } from '../middlewares/handleErrors';

const ajv = new Ajv();
addFormats(ajv);

export function sendInvalidDataError(validateFunction: ValidateFunction<unknown>): void {
  const errors = validateFunction.errors as DefinedError[];
  let errorMsg = 'Invalid data!';
  if (errors.length > 0) {
    errorMsg = errors[0].schemaPath + ' ' + errors[0].message || errorMsg;
  }
  throw new AppError(errorMsg, ErrorCode.INVALID_DATA);
}

export { ajv };
