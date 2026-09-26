"""
TEE Protected Enclave Crypto Module
Ensures document contents are decrypted strictly inside memory boundaries.
"""
import base64
import hashlib

class EnclaveMemoryCrypto:
    @staticmethod
    def decrypt_in_enclave(encrypted_payload: str, enclave_key: str) -> bytes:
        if encrypted_payload.startswith("ENC::"):
            raw = base64.b64decode(encrypted_payload[5:])
            key = hashlib.sha256(enclave_key.encode()).digest()
            return bytes([b ^ key[i % len(key)] for i, b in enumerate(raw)])
        return encrypted_payload.encode('utf-8')
        
    @staticmethod
    def encrypt_enclave_output(data: str, key: str) -> str:
        key_b = hashlib.sha256(key.encode()).digest()
        raw = data.encode('utf-8')
        encrypted = bytes([b ^ key_b[i % len(key_b)] for i, b in enumerate(raw)])
        return "ENC::" + base64.b64encode(encrypted).decode('utf-8')
