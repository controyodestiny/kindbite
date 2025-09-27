#!/usr/bin/env python3
"""
KindBite Backend Setup Script
Quick setup for development environment.
"""
import os
import sys
import subprocess
import shutil


def run_command(command, description):
    """Run a command and handle errors."""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False


def main():
    """Main setup function."""
    print("🌍 KindBite Backend Setup")
    print("=" * 40)
    
    # Check if Python is available
    if not run_command("python --version", "Checking Python installation"):
        print("❌ Python is not installed or not in PATH")
        sys.exit(1)
    
    # Check if we're in a virtual environment
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("⚠️  Warning: Not in a virtual environment")
        create_venv = input("Create virtual environment? (y/N): ").lower().startswith('y')
        
        if create_venv:
            if not run_command("python -m venv venv", "Creating virtual environment"):
                sys.exit(1)
            print("📝 Please activate the virtual environment:")
            if os.name == 'nt':  # Windows
                print("   venv\\Scripts\\activate")
            else:  # Unix/Linux/macOS
                print("   source venv/bin/activate")
            print("Then run this setup script again.")
            sys.exit(0)
    
    # Install requirements
    if not run_command("pip install -r requirements.txt", "Installing Python packages"):
        sys.exit(1)
    
    # Create .env file if it doesn't exist
    if not os.path.exists('.env'):
        if os.path.exists('env.example'):
            shutil.copy('env.example', '.env')
            print("✅ Created .env file from env.example")
            print("📝 Please edit .env file with your configuration")
        else:
            print("⚠️  env.example not found, skipping .env creation")
    
    # Create logs directory
    if not os.path.exists('logs'):
        os.makedirs('logs')
        print("✅ Created logs directory")
    
    # Run migrations
    if not run_command("python manage.py makemigrations", "Creating database migrations"):
        print("⚠️  Migration creation failed, but continuing...")
    
    if not run_command("python manage.py migrate", "Applying database migrations"):
        print("❌ Database migration failed")
        sys.exit(1)
    
    # Create superuser
    print("\n👤 Create Admin User")
    print("=" * 20)
    create_admin = input("Create admin superuser? (Y/n): ").lower()
    
    if not create_admin.startswith('n'):
        print("📝 Please provide admin user details:")
        if not run_command("python manage.py createsuperuser", "Creating admin superuser"):
            print("⚠️  Superuser creation skipped")
    
    # Success message
    print("\n🎉 Setup completed successfully!")
    print("=" * 40)
    print("🚀 To start the development server:")
    print("   python manage.py runserver")
    print("\n📊 Access admin interface at:")
    print("   http://localhost:8000/admin/")
    print("\n📖 API documentation:")
    print("   http://localhost:8000/api/v1/")
    print("\n🔗 Connect your React frontend to:")
    print("   http://localhost:8000/api/v1/auth/")


if __name__ == "__main__":
    main()




