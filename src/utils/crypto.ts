// Client-side tactical cryptographic cipher utility
// Simulates military-grade PGP/AES ciphertext formatting with real symmetric ciphering

export class TacticalCrypto {
  /**
   * Encrypts plain text using a simple symmetric XOR + Base64 cipher with tactical PGP armor headers
   */
  public static encrypt(plainText: string, secretKey: string = 'CIPHER_SEC_KEY_ALPHA'): { ciphertext: string; fingerprint: string } {
    if (!plainText) return { ciphertext: '', fingerprint: '' };

    try {
      const keyChars = secretKey.split('').map(c => c.charCodeAt(0));
      const encryptedChars = [];

      for (let i = 0; i < plainText.length; i++) {
        const charCode = plainText.charCodeAt(i);
        const keyChar = keyChars[i % keyChars.length];
        encryptedChars.push(String.fromCharCode(charCode ^ keyChar));
      }

      const encoded = btoa(unescape(encodeURIComponent(encryptedChars.join(''))));
      const fingerprint = this.generateFingerprint(secretKey);

      const armored = `-----BEGIN CIPHER CLASSIFIED MESSAGE-----\nVersion: TacticalPGP v4.2-ECC\nKeyID: ${fingerprint}\n\n${encoded}\n-----END CIPHER CLASSIFIED MESSAGE-----`;

      return {
        ciphertext: armored,
        fingerprint
      };
    } catch {
      return {
        ciphertext: plainText,
        fingerprint: 'ERR_CIPHER'
      };
    }
  }

  /**
   * Decrypts ciphertext packet
   */
  public static decrypt(armoredText: string, secretKey: string = 'CIPHER_SEC_KEY_ALPHA'): string {
    if (!armoredText) return '';
    if (!armoredText.includes('BEGIN CIPHER CLASSIFIED MESSAGE')) {
      return armoredText; // Not encrypted
    }

    try {
      const match = armoredText.match(/KeyID: ([A-Z0-9-]+)\n\n([\s\S]*?)\n-----END/);
      if (!match || !match[2]) return armoredText;

      const encoded = match[2].trim();
      const decodedRaw = decodeURIComponent(escape(atob(encoded)));
      const keyChars = secretKey.split('').map(c => c.charCodeAt(0));

      const decryptedChars = [];
      for (let i = 0; i < decodedRaw.length; i++) {
        const charCode = decodedRaw.charCodeAt(i);
        const keyChar = keyChars[i % keyChars.length];
        decryptedChars.push(String.fromCharCode(charCode ^ keyChar));
      }

      return decryptedChars.join('');
    } catch {
      return '[ENCRYPTED DATA PACKET // DECRYPTION KEY MISMATCH]';
    }
  }

  public static generateFingerprint(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    return `0x${hex.substring(0, 4)}-${hex.substring(4, 8)}`;
  }
}
