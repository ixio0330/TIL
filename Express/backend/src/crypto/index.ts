import { randomBytes, pbkdf2} from 'crypto';
import { promisify } from 'util';

interface VerifyPassword {
  password: string;
  salt: string;
  hashPassword: string
}

const randomBytesPromise = promisify(randomBytes);
const pbkdf2Promise = promisify(pbkdf2);

const createSalt = async () => {
  const buf = await randomBytesPromise(65);
  return buf.toString('base64');
}

export const createHashedPassword = async (password: string) => {
  const salt = await createSalt();
  const key = await pbkdf2Promise(password, salt, 104906, 64, 'sha512');
  const hashPassword = key.toString('base64');
  return {
    hashPassword, 
    salt
  };
};

export const verifyPassword = async ({ hashPassword, password, salt }: VerifyPassword) => {
  const key = await pbkdf2Promise(password, salt, 104906, 64, 'sha512');
  const hashedPassword = key.toString('base64');
  return hashPassword === hashedPassword;
};