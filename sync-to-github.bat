@echo off
echo ========================================================
echo   Syncing bambiboy602.com with GitHub
echo ========================================================
cd /d "%~dp0"

echo Staging changes...
git add .

set /p commitMsg="Enter commit message (or press Enter for default): "
if "%commitMsg%"=="" set commitMsg=Update site and standalone Tom bot
git commit -m "%commitMsg%"

echo.
echo Pulling latest changes from GitHub to prevent conflicts...
git pull --rebase origin main

echo.
echo Pushing to GitHub main branch...
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo ========================================================
    echo Standard push was rejected by GitHub.
    echo Would you like to force push your latest local work?
    echo ========================================================
    set /p forceConfirm="Force push to origin main? (Y/N): "
    if /i "%forceConfirm%"=="Y" (
        git push -u origin main --force
    )
)

echo.
echo ========================================================
echo   Sync Complete! GitHub Actions will auto-deploy.
echo ========================================================
pause
