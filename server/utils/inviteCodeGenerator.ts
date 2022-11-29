import base64url from 'base64url';
import crypto from 'crypto';

/**
 * Function to generate the invite code for the teacher to
 * create access for student' parents
 * @param {number} length length of the invite code needed
 * @returns {string} invite code generated
 */
export function inviteCodeGenerator(length: number): string {
  return base64url(crypto.randomBytes(length)).slice(0, length);
}
