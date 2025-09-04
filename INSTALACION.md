# Guía de Instalación y Configuración - SGI-GO

## Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación del Backend](#instalación-del-backend)
3. [Instalación del Frontend](#instalación-del-frontend)
4. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
5. [Configuración del Entorno](#configuración-del-entorno)
6. [Iniciar el Sistema](#iniciar-el-sistema)
7. [Despliegue en Producción](#despliegue-en-producción)
8. [Solución de Problemas](#solución-de-problemas)

## Requisitos Previos

Antes de comenzar la instalación, asegúrese de tener instalados los siguientes componentes:

### Software Necesario

- **Go**: Versión 1.24.3 o superior
  - [Descargar Go](https://golang.org/dl/)
  - Verificar instalación: `go version`

- **Node.js**: Versión 18.x o superior
  - [Descargar Node.js](https://nodejs.org/)
  - Verificar instalación: `node -v`

- **npm**: Versión 9.x o superior (incluido con Node.js)
  - Verificar instalación: `npm -v`

- **PostgreSQL**: Versión 14.x o superior
  - [Descargar PostgreSQL](https://www.postgresql.org/download/)
  - Verificar instalación: `psql --version`

- **Git**: Última versión estable
  - [Descargar Git](https://git-scm.com/downloads)
  - Verificar instalación: `git --version`

### Requisitos de Hardware Recomendados

- **Desarrollo**:
  - CPU: 2 núcleos o más
  - RAM: 4GB mínimo, 8GB recomendado
  - Almacenamiento: 1GB disponible

- **Producción**:
  - CPU: 4 núcleos o más
  - RAM: 8GB mínimo, 16GB recomendado
  - Almacenamiento: 10GB disponible (depende del volumen de datos)

## Instalación del Backend

### 1. Clonar el Repositorio

```bash
git clone https://github.com/gabykap29/SGI-GO.git
cd SGI-GO
```

### 2. Configurar el Backend

```bash
cd server
```

### 3. Instalar Dependencias

```bash
go mod download
```

### 4. Compilar el Proyecto

```bash
go build -o sgi-go.exe
```

Esto generará un ejecutable `sgi-go.exe` en el directorio actual.

## Instalación del Frontend

### 1. Navegar al Directorio del Cliente

```bash
cd ../client
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Compilar para Producción (Opcional)

```bash
npm run build
```

Esto generará una versión optimizada del frontend en el directorio `client/.next`.

## Configuración de la Base de Datos

### 1. Crear una Base de Datos en PostgreSQL

```sql
CREATE DATABASE sgi_go;
```

### 2. Crear un Usuario para la Base de Datos (Opcional)

```sql
CREATE USER sgi_user WITH PASSWORD 'tu_contraseña';
GRANT ALL PRIVILEGES ON DATABASE sgi_go TO sgi_user;
```

### 3. Configurar la Conexión a la Base de Datos

Edite el archivo `server/config/config.go` para configurar la conexión a la base de datos:

```go
// Ejemplo de configuración
var (
    DBHost     = "localhost"
    DBPort     = "5432"
    DBUser     = "sgi_user"
    DBPassword = "tu_contraseña"
    DBName     = "sgi_go"
    SSLMode    = "disable"
)
```

## Configuración del Entorno

### 1. Configuración del Backend

Edite el archivo `server/config/config.go` para ajustar otros parámetros según sea necesario:

- Puerto del servidor
- Configuración de JWT
- Rutas de almacenamiento de archivos
- Otros parámetros específicos de la aplicación

### 2. Configuración del Frontend

Cree un archivo `.env.local` en el directorio `client` con las siguientes variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Ajuste la URL según la configuración de su servidor backend.

### 3. Configuración del Script de Inicio

Copie el archivo `start-services-example.bat` a `start-services.bat` y edítelo para ajustar las rutas según su entorno:

```batch
@echo off
echo ==========================================
echo Iniciando backend (Go) y frontend (Next.js)
echo ==========================================

:: Ir a la carpeta del backend y ejecutar el binario de Go
start "" "C:\Ruta\A\Tu\Proyecto\SGI-GO\server\sgi-go.exe"

:: Ir a la carpeta del frontend y ejecutar npm start
cd /d "C:\Ruta\A\Tu\Proyecto\SGI-GO\client"
start "" cmd /k "npm run start"

echo ==========================================
echo Ambos servicios fueron iniciados.
echo ==========================================
```

## Iniciar el Sistema

### Método 1: Usando el Script de Inicio

Ejecute el script `start-services.bat` que configuró anteriormente:

```bash
start-services.bat
```

### Método 2: Inicio Manual

#### Iniciar el Backend

```bash
cd server
./sgi-go.exe
```

#### Iniciar el Frontend

```bash
cd client
npm run dev  # Para desarrollo
# o
npm run start  # Para producción (después de build)
```

### Acceso al Sistema

Una vez iniciados los servicios, puede acceder al sistema a través de su navegador web:

- Frontend: [http://localhost:3000](http://localhost:3000)
- API Backend: [http://localhost:8080](http://localhost:8080)

## Despliegue en Producción

### Consideraciones para Producción

1. **Seguridad**:
   - Utilice HTTPS para todas las comunicaciones
   - Configure correctamente los encabezados de seguridad
   - Utilice contraseñas fuertes para la base de datos

2. **Rendimiento**:
   - Configure un servidor proxy inverso (Nginx, Apache) para servir archivos estáticos
   - Implemente caché donde sea apropiado

3. **Respaldos**:
   - Configure respaldos automáticos de la base de datos
   - Implemente una estrategia de recuperación ante desastres

### Pasos para el Despliegue

1. **Preparar el Servidor**:
   - Instale Go, Node.js y PostgreSQL en el servidor
   - Configure el firewall para permitir el tráfico necesario

2. **Desplegar el Backend**:
   - Compile el backend para producción
   - Configure un servicio del sistema para mantener el backend en ejecución

3. **Desplegar el Frontend**:
   - Compile el frontend para producción (`npm run build`)
   - Configure un servidor web para servir los archivos estáticos

4. **Configurar un Proxy Inverso** (Opcional pero recomendado):
   - Instale y configure Nginx o Apache
   - Configure el proxy para dirigir el tráfico al backend y frontend

## Solución de Problemas

### Problemas Comunes y Soluciones

#### Error de Conexión a la Base de Datos

**Síntoma**: El servidor muestra errores al intentar conectarse a la base de datos.

**Soluciones**:
- Verifique que PostgreSQL esté en ejecución
- Compruebe las credenciales en `config.go`
- Asegúrese de que la base de datos exista
- Verifique que el usuario tenga los permisos necesarios

#### El Frontend No Puede Conectarse al Backend

**Síntoma**: La interfaz de usuario muestra errores al intentar cargar datos.

**Soluciones**:
- Verifique que el backend esté en ejecución
- Compruebe la URL de la API en `.env.local`
- Verifique que no haya problemas de CORS

#### Errores de Compilación

**Síntoma**: Errores al compilar el backend o frontend.

**Soluciones**:
- Verifique que todas las dependencias estén instaladas
- Actualice Go y Node.js a las versiones recomendadas
- Limpie las cachés de compilación

### Registros y Diagnóstico

- **Registros del Backend**: Verifique la salida de la consola del servidor Go
- **Registros del Frontend**: Verifique la consola del navegador y los registros de Next.js
- **Registros de PostgreSQL**: Verifique los registros de PostgreSQL para problemas de base de datos

### Contacto de Soporte

Si encuentra problemas que no puede resolver, contacte al equipo de desarrollo:

- **Correo Electrónico**: soporte@sgi-go.com
- **Repositorio**: Abra un issue en el repositorio de GitHub

---

© 2023 Sistema de Gestión de Informes (SGI-GO). Todos los derechos reservados.
