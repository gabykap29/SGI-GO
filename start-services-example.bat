@echo off
echo ==========================================
echo Iniciando backend (Go) y frontend (Next.js)
echo ==========================================

:: Ir a la carpeta del backend y ejecutar el binario de Go
start "" "C:\Users\[usuario]\Desktop\SGI-GO\server\sgi-go.exe"

:: Ir a la carpeta del frontend y ejecutar npm start
cd /d "C:\Users\[usuario]\Desktop\SGI-GO\client"
start "" cmd /k "npm run start"

echo ==========================================
echo Ambos servicios fueron iniciados.
echo ==========================================
