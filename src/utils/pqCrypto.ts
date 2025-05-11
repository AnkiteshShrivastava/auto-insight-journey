
import { KeyPair, createKeyPair, encrypt, decrypt } from 'crystals-kyber';

/**
 * Stores the key pair in local storage
 * @param keyPair - The Kyber key pair
 */
export const storeKeyPair = (keyPair: KeyPair) => {
  localStorage.setItem('pq_public_key', Buffer.from(keyPair.publicKey).toString('base64'));
  localStorage.setItem('pq_private_key', Buffer.from(keyPair.secretKey).toString('base64'));
};

/**
 * Retrieves the key pair from local storage
 * @returns The Kyber key pair or null if not found
 */
export const retrieveKeyPair = (): KeyPair | null => {
  const publicKey = localStorage.getItem('pq_public_key');
  const privateKey = localStorage.getItem('pq_private_key');
  
  if (!publicKey || !privateKey) {
    return null;
  }
  
  return {
    publicKey: Buffer.from(publicKey, 'base64'),
    secretKey: Buffer.from(privateKey, 'base64')
  };
};

/**
 * Generates a new post-quantum key pair using Kyber
 * @returns The generated key pair
 */
export const generateKeyPair = async (): Promise<KeyPair> => {
  const keyPair = await createKeyPair();
  storeKeyPair(keyPair);
  return keyPair;
};

/**
 * Encrypts sensitive data using Kyber post-quantum algorithm
 * @param data - The data to encrypt
 * @param publicKey - The public key (optional, will use stored key if not provided)
 * @returns The encrypted data as a base64 string
 */
export const encryptData = async (data: Record<string, any>, publicKey?: Uint8Array): Promise<string> => {
  let key = publicKey;
  
  if (!key) {
    let keyPair = retrieveKeyPair();
    if (!keyPair) {
      keyPair = await generateKeyPair();
    }
    key = keyPair.publicKey;
  }
  
  const dataStr = JSON.stringify(data);
  const dataBuffer = Buffer.from(dataStr);
  
  // Split into chunks if data is too large (Kyber has input limits)
  const chunkSize = 32; // Max safe size for Kyber input
  const chunks = [];
  
  for (let i = 0; i < dataBuffer.length; i += chunkSize) {
    const chunk = dataBuffer.slice(i, i + chunkSize);
    const encryptedChunk = await encrypt(key, chunk);
    chunks.push(Buffer.from(encryptedChunk).toString('base64'));
  }
  
  return JSON.stringify(chunks);
};

/**
 * Decrypts sensitive data using Kyber post-quantum algorithm
 * @param encryptedData - The encrypted data as a base64 string
 * @param secretKey - The secret key (optional, will use stored key if not provided)
 * @returns The decrypted data object or null if decryption fails
 */
export const decryptData = async (encryptedData: string, secretKey?: Uint8Array): Promise<Record<string, any> | null> => {
  try {
    let key = secretKey;
    
    if (!key) {
      const keyPair = retrieveKeyPair();
      if (!keyPair) {
        console.error("No private key available for decryption");
        return null;
      }
      key = keyPair.secretKey;
    }
    
    const chunks = JSON.parse(encryptedData) as string[];
    const decryptedChunks = [];
    
    for (const chunk of chunks) {
      const encryptedChunkBuffer = Buffer.from(chunk, 'base64');
      const decryptedChunk = await decrypt(key, encryptedChunkBuffer);
      decryptedChunks.push(Buffer.from(decryptedChunk).toString());
    }
    
    const decryptedStr = decryptedChunks.join('');
    return JSON.parse(decryptedStr);
  } catch (error) {
    console.error("Failed to decrypt data:", error);
    return null;
  }
};
