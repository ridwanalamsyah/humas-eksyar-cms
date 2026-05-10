@echo off
echo ========================================
echo FIX GIT CONFIG - ridwanalamsyah
echo ========================================
echo.

cd /d "C:\Users\Ridwan Alamsyah\Downloads\humas_eksyar_flutter\docs"

echo [1] Setup git config...
git config user.email "ridwanalamsyah@users.noreply.github.com"
git config user.name "ridwanalamsyah"
echo [OK] Git config di-set
echo.

echo [2] Commit ulang...
git add .
git commit -m "Deploy to GitHub Pages"
echo [OK] Committed
echo.

echo [3] Push ke GitHub...
git push -u origin master --force
echo.

if errorlevel 1 (
    echo [X] Push gagal
echo.
    echo Solusi:
    echo 1. Pastikan repo sudah dibuat: https://github.com/new
echo 2. Username: ridwanalamsyah
echo 3. Repo name: humas-eksyar-cms
echo.
) else (
    echo [OK] Push berhasil!
echo.
    echo Repository: https://github.com/ridwanalamsyah/humas-eksyar-cms
echo Aktifkan Pages: Settings ^> Pages ^> master /docs
echo.
)

pause
