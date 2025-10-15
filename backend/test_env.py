#!/usr/bin/env python3
"""
Test script to check if .env file is being loaded properly
"""
import os
from decouple import config

print("Testing .env file loading...")
print(f"Current working directory: {os.getcwd()}")
print(f"Files in current directory: {os.listdir('.')}")

# Check if .env file exists
if os.path.exists('.env'):
    print("✅ .env file exists")
    with open('.env', 'r') as f:
        content = f.read()
        print(f"📄 .env file content:\n{content}")
else:
    print("❌ .env file not found")

# Test decouple loading
print("\nTesting decouple config loading:")
try:
    secret_key = config('SECRET_KEY', default='NOT_FOUND')
    debug = config('DEBUG', default='NOT_FOUND')
    openai_key = config('OPENAI_API_KEY', default='NOT_FOUND')
    
    print(f"SECRET_KEY: {secret_key[:20]}..." if len(secret_key) > 20 else f"SECRET_KEY: {secret_key}")
    print(f"DEBUG: {debug}")
    print(f"OPENAI_API_KEY: {openai_key[:20]}..." if len(openai_key) > 20 else f"OPENAI_API_KEY: {openai_key}")
    
    if openai_key and openai_key != 'NOT_FOUND' and openai_key != 'your-openai-api-key-here':
        print("✅ OpenAI API key loaded successfully")
    else:
        print("❌ OpenAI API key not loaded properly")
        
except Exception as e:
    print(f"❌ Error loading config: {e}")
















