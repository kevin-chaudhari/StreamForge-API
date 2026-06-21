import { ApiError } from "../utils/ApiError.js";

/**
 * Validates that none of the provided fields are empty strings.
 * @param {string[]} fields - Array of field values to validate.
 * @throws {ApiError} 400 if any field is empty.
 */
const validateUserFields = (fields) => {
  if (fields.some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Required field is empty");
  }
};

/**
 * Validates that a string is a properly formatted email address.
 * @param {string} email
 * @returns {RegExpMatchArray | null}
 */
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export { validateUserFields, validateEmail };
