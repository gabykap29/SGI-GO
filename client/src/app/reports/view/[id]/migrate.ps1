#!/usr/bin/env pwsh
# Script de migración para aplicar la refactorización

param(
    [switch]$DryRun = $false,
    [switch]$Backup = $true,
    [switch]$Rollback = $false
)

$ReportViewPath = "c:\Users\gabri\Desktop\SGI-GO\client\src\app\reports\view\[id]"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Script de Migración - Vista de Informe" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if ($Rollback) {
    Write-Host "🔄 Modo ROLLBACK activado" -ForegroundColor Yellow
    Write-Host ""
    
    if (Test-Path "$ReportViewPath\page-backup.js") {
        if ($DryRun) {
            Write-Host "[DRY RUN] Se restauraría el backup:" -ForegroundColor Yellow
            Write-Host "  - Copiar page-backup.js -> page.js" -ForegroundColor Gray
        } else {
            Copy-Item "$ReportViewPath\page-backup.js" "$ReportViewPath\page.js" -Force
            Write-Host "✅ Backup restaurado exitosamente" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ No se encontró backup (page-backup.js)" -ForegroundColor Red
        exit 1
    }
    exit 0
}

Write-Host "📋 Configuración:" -ForegroundColor White
Write-Host "  - Ruta: $ReportViewPath" -ForegroundColor Gray
Write-Host "  - Dry Run: $DryRun" -ForegroundColor Gray
Write-Host "  - Crear Backup: $Backup" -ForegroundColor Gray
Write-Host ""

# Verificar que existen los archivos necesarios
$RequiredFiles = @(
    "page.js",
    "page-refactored.js",
    "components\ReportHeader.js",
    "hooks\useReportData.js"
)

Write-Host "🔍 Verificando archivos..." -ForegroundColor White
$AllFilesExist = $true

foreach ($File in $RequiredFiles) {
    $FullPath = Join-Path $ReportViewPath $File
    if (Test-Path $FullPath) {
        Write-Host "  ✓ $File" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $File (No encontrado)" -ForegroundColor Red
        $AllFilesExist = $false
    }
}

if (-not $AllFilesExist) {
    Write-Host ""
    Write-Host "❌ Faltan archivos necesarios. Abortando migración." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Todos los archivos necesarios están presentes" -ForegroundColor Green
Write-Host ""

# Crear backup si está habilitado
if ($Backup -and -not $DryRun) {
    Write-Host "💾 Creando backup del archivo original..." -ForegroundColor White
    
    $BackupPath = "$ReportViewPath\page-backup.js"
    if (Test-Path $BackupPath) {
        Write-Host "  ⚠️  Ya existe un backup. Se sobrescribirá." -ForegroundColor Yellow
    }
    
    Copy-Item "$ReportViewPath\page.js" $BackupPath -Force
    Write-Host "  ✓ Backup creado: page-backup.js" -ForegroundColor Green
    Write-Host ""
}

# Aplicar migración
Write-Host "🔄 Aplicando migración..." -ForegroundColor White

if ($DryRun) {
    Write-Host ""
    Write-Host "[DRY RUN] Se realizarían las siguientes acciones:" -ForegroundColor Yellow
    Write-Host "  1. Copiar page.js -> page-backup.js" -ForegroundColor Gray
    Write-Host "  2. Copiar page-refactored.js -> page.js" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Ejecuta sin -DryRun para aplicar los cambios." -ForegroundColor Yellow
} else {
    Copy-Item "$ReportViewPath\page-refactored.js" "$ReportViewPath\page.js" -Force
    Write-Host "  ✓ Migración aplicada exitosamente" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "  ✅ MIGRACIÓN COMPLETADA" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Archivos creados:" -ForegroundColor White
    Write-Host "  - page.js (nueva versión refactorizada)" -ForegroundColor Gray
    if ($Backup) {
        Write-Host "  - page-backup.js (versión original)" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "Próximos pasos:" -ForegroundColor White
    Write-Host "  1. Ejecuta 'npm run dev' para probar la aplicación" -ForegroundColor Gray
    Write-Host "  2. Verifica que todo funcione correctamente" -ForegroundColor Gray
    Write-Host "  3. Si hay problemas, ejecuta con -Rollback para revertir" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Para revertir cambios:" -ForegroundColor Yellow
    Write-Host "  .\migrate.ps1 -Rollback" -ForegroundColor Gray
    Write-Host ""
}

# Mostrar estadísticas
Write-Host "📊 Estadísticas:" -ForegroundColor White

$OriginalSize = (Get-Item "$ReportViewPath\page-backup.js" -ErrorAction SilentlyContinue).Length
$RefactoredSize = (Get-Item "$ReportViewPath\page-refactored.js").Length

if ($OriginalSize) {
    $OriginalLines = (Get-Content "$ReportViewPath\page-backup.js").Count
    $RefactoredLines = (Get-Content "$ReportViewPath\page-refactored.js").Count
    
    Write-Host "  - Líneas originales: $OriginalLines" -ForegroundColor Gray
    Write-Host "  - Líneas refactorizadas: $RefactoredLines" -ForegroundColor Gray
    
    $Reduction = [math]::Round((($OriginalLines - $RefactoredLines) / $OriginalLines) * 100, 2)
    Write-Host "  - Reducción: $Reduction%" -ForegroundColor Green
}

Write-Host ""
Write-Host "📚 Documentación disponible:" -ForegroundColor White
Write-Host "  - README.md - Guía de uso" -ForegroundColor Gray
Write-Host "  - REFACTORING.md - Detalles de refactorización" -ForegroundColor Gray
Write-Host "  - ARCHITECTURE.md - Arquitectura y diagramas" -ForegroundColor Gray
Write-Host ""
