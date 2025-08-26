#!/usr/bin/env python3
"""
LoopFund AI Setup Script
This script helps you set up the AI Financial Advisor backend
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed!")
        print(f"Error: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    print("🐍 Checking Python version...")
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ is required!")
        print(f"Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible!")
    return True

def install_dependencies():
    """Install required Python packages"""
    print("\n📦 Installing dependencies...")
    
    # Upgrade pip first
    if not run_command("python -m pip install --upgrade pip", "Upgrading pip"):
        return False
    
    # Install requirements
    if not run_command("pip install -r requirements.txt", "Installing requirements"):
        return False
    
    return True

def test_ai_service():
    """Test if the AI service can be imported"""
    print("\n🧪 Testing AI service...")
    try:
        sys.path.append(os.path.join(os.path.dirname(__file__), 'ai'))
        from ai.financial_advisor import FinancialAdvisor
        print("✅ AI service imported successfully!")
        return True
    except ImportError as e:
        print(f"❌ Failed to import AI service: {e}")
        return False

def create_env_file():
    """Create environment file with configuration"""
    print("\n⚙️ Creating environment configuration...")
    
    env_content = """# LoopFund AI Configuration
FLASK_ENV=development
FLASK_DEBUG=True
AI_MODEL=mistralai/Mistral-7B-Instruct
API_PORT=5000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
"""
    
    try:
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ Environment file created!")
        return True
    except Exception as e:
        print(f"❌ Failed to create environment file: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 LoopFund AI Setup Script")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        print("\n❌ Setup cannot continue. Please upgrade Python.")
        return
    
    # Install dependencies
    if not install_dependencies():
        print("\n❌ Failed to install dependencies. Please check the errors above.")
        return
    
    # Test AI service
    if not test_ai_service():
        print("\n❌ AI service test failed. Please check the errors above.")
        return
    
    # Create environment file
    create_env_file()
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start the backend: python app.py")
    print("2. The AI service will be available at http://localhost:5000")
    print("3. Test the API: curl http://localhost:5000/api/health")
    print("4. Integrate with your React frontend")
    
    print("\n⚠️ Important notes:")
    print("- The first time you run the AI service, it will download the Mistral model (~14GB)")
    print("- This may take several minutes depending on your internet connection")
    print("- Make sure you have enough disk space and RAM (8GB+ recommended)")
    
    print("\n🔗 Useful endpoints:")
    print("- GET  /api/health - Health check")
    print("- POST /api/ai/chat - AI chat")
    print("- POST /api/ai/savings-plan - Generate savings plan")
    print("- POST /api/ai/budget-analysis - Budget analysis")
    print("- GET  /api/ai/quick-tips - Financial tips")

if __name__ == "__main__":
    main()
