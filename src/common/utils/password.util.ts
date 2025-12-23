import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash password with bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    return hashed;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * Compare password with hash
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error comparing password:', error);
    throw new Error('Failed to compare password');
  }
};
