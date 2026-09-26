import base64
import hashlib
from backend.app.core.config import settings

def _derive_key(secret_str: str) -> bytes:
    return hashlib.sha256(secret_str.encode()).digest()

def encrypt_data(plain_text: str) -> str:
    """Simple obfuscated symmetric encryption for demo storage (compatible with TEE enclave storage)"""
    if not plain_text:
        return ""
    key = _derive_key(settings.ENCRYPTION_KEY)
    text_bytes = plain_text.encode('utf-8')
    xor_bytes = bytes([b ^ key[i % len(key)] for i, b in enumerate(text_bytes)])
    return "ENC::" + base64.b64encode(xor_bytes).decode('utf-8')

def decrypt_data(encrypted_text: str) -> str:
    if not encrypted_text or not encrypted_text.startswith("ENC::"):
        return encrypted_text
    try:
        raw_b64 = encrypted_text[5:]
        xor_bytes = base64.b64decode(raw_b64)
        key = _derive_key(settings.ENCRYPTION_KEY)
        text_bytes = bytes([b ^ key[i % len(key)] for i, b in enumerate(xor_bytes)])
        return text_bytes.decode('utf-8')
    except Exception:
        return "[Decryption Failed]"
