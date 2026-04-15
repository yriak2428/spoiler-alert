# spoiler-alert
1. Fork the repo and then clone the forked repo to your local machine
## **FRONTEND**
1. Open the respective folder
 `cd ./frontend/spoiler-alert`
2. Run `npm install` to install dependencies
3. Follow this tutorial for the "Android Emulator" and "Development Build" option and check the "Build with Expo Application Services (EAS)" option.

   https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&platform=android&device=simulated&buildEnv=local
4. Make sure that the application can open in the android emulator in your laptop.

## **BACKEND**
1. Open the respective folder
 `cd ./backend/`
2. Create a Python virtual environment
  `python3 -m venv .venv`
3. Start your virtual environment
   `source .venv/bin/activate`
4. Install poetry
   `pip install poetry`
5. Install locked dependencies
   `poetry install`

**IMPORTANT**
1. Always start your virtual environment before running your Python application
2. Always deactivate your virtual environment when working on other Python projects
   `deactivate`
3. Always install new dependencies with poetry and not pip
   `poetry add YOUR_PACKAGE_NAME` and then
   `poetry lock`
