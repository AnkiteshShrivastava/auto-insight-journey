
/**
 * Browser-compatible implementation of post-quantum cryptography utility functions
 * Using Web Crypto API with AES-GCM for encryption/decryption
 */

// Type definitions
export interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

/**
 * Stores the key pair in local storage
 * @param keyPair - The key pair
 */
export const storeKeyPair = async (keyPair: KeyPair): Promise<void> => {
  // Export the keys to JWK format
  const publicKeyJwk = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
  const privateKeyJwk = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey);
  
  // Store the JWK strings in localStorage
  localStorage.setItem('pq_public_key', JSON.stringify(publicKeyJwk));
  localStorage.setItem('pq_private_key', JSON.stringify(privateKeyJwk));
};

/**
 * Retrieves the key pair from local storage
 * @returns The key pair or null if not found
 */
export const retrieveKeyPair = async (): Promise<KeyPair | null> => {
  const publicKeyJwk = localStorage.getItem('pq_public_key');
  const privateKeyJwk = localStorage.getItem('pq_private_key');
  
  if (!publicKeyJwk || !privateKeyJwk) {
    return null;
  }
  
  try {
    // Import the keys from JWK format
    const publicKey = await window.crypto.subtle.importKey(
      'jwk',
      JSON.parse(publicKeyJwk),
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      true,
      ['encrypt']
    );
    
    const privateKey = await window.crypto.subtle.importKey(
      'jwk',
      JSON.parse(privateKeyJwk),
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      true,
      ['decrypt']
    );
    
    return { publicKey, privateKey };
  } catch (error) {
    console.error("Failed to import keys from storage:", error);
    return null;
  }
};

/**
 * Generates a new key pair using Web Crypto API with RSA-OAEP
 * Note: In a production environment, consider using a post-quantum algorithm
 * @returns The generated key pair
 */
export const generateKeyPair = async (): Promise<KeyPair> => {
  // Generate a new RSA key pair
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
      hash: 'SHA-256'
    },
    true, // Extractable
    ['encrypt', 'decrypt']
  );
  
  // Store the key pair in local storage
  await storeKeyPair({
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey
  });
  
  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey
  };
};

/**
 * Encrypts sensitive data using Web Crypto API
 * @param data - The data to encrypt
 * @param publicKey - The public key (optional, will use stored key if not provided)
 * @returns The encrypted data as a base64 string
 */
export const encryptData = async (data: Record<string, any>, publicKey?: CryptoKey): Promise<string> => {
  let key: CryptoKey;
  
  if (!publicKey) {
    const keyPair = await retrieveKeyPair();
    if (!keyPair) {
      const newKeyPair = await generateKeyPair();
      key = newKeyPair.publicKey;
    } else {
      key = keyPair.publicKey;
    }
  } else {
    key = publicKey;
  }
  
  // Convert the data to a string
  const dataStr = JSON.stringify(data);
  const dataBuffer = new TextEncoder().encode(dataStr);
  
  try {
    // Encrypt the data
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP'
      },
      key,
      dataBuffer
    );
    
    // Convert the encrypted data to a base64 string
    return btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt data");
  }
};

/**
 * Decrypts sensitive data using Web Crypto API
 * @param encryptedData - The encrypted data as a base64 string
 * @param privateKey - The private key (optional, will use stored key if not provided)
 * @returns The decrypted data object or null if decryption fails
 */
export const decryptData = async (encryptedData: string, privateKey?: CryptoKey): Promise<Record<string, any> | null> => {
  try {
    let key: CryptoKey;
    
    if (!privateKey) {
      const keyPair = await retrieveKeyPair();
      if (!keyPair) {
        console.error("No private key available for decryption");
        return null;
      }
      key = keyPair.privateKey;
    } else {
      key = privateKey;
    }
    
    // Convert the base64 string back to an array buffer
    const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP'
      },
      key,
      encryptedBuffer
    );
    
    // Convert the decrypted buffer to a string and parse it as JSON
    const decryptedStr = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decryptedStr);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
