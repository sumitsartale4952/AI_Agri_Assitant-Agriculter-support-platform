# Start Frontend Server
Set-Location "D:\ai-agri-assistant\frontend"

Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

Write-Host "`nStarting Vite dev server..." -ForegroundColor Green
npm run dev
