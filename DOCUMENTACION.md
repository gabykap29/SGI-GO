# Documentación del Sistema de Gestión de Informes (SGI-GO)

## Índice

1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Requisitos del Sistema](#requisitos-del-sistema)
4. [Instalación](#instalación)
5. [Configuración](#configuración)
6. [Uso del Sistema](#uso-del-sistema)
7. [Funcionalidades](#funcionalidades)
8. [Estructura del Proyecto](#estructura-del-proyecto)
9. [API y Endpoints](#api-y-endpoints)
10. [Mantenimiento](#mantenimiento)

## Introducción

El Sistema de Gestión de Informes (SGI-GO) es una aplicación web desarrollada para la creación, edición, visualización y eliminación de informes de distintos tipos. El sistema permite gestionar usuarios con diferentes roles, personas, y establecer relaciones entre personas e informes.

La aplicación está construida con una arquitectura moderna de microservicios, utilizando Go para el backend y Next.js para el frontend, lo que proporciona un rendimiento óptimo y una experiencia de usuario fluida.

## Arquitectura del Sistema

SGI-GO utiliza una arquitectura cliente-servidor:

- **Backend**: Desarrollado en Go, proporciona una API RESTful para la gestión de datos.
- **Frontend**: Desarrollado con Next.js (React), ofrece una interfaz de usuario moderna y responsiva.
- **Base de Datos**: PostgreSQL para el almacenamiento persistente de datos.

### Diagrama de Arquitectura

```
+----------------+      +----------------+      +----------------+
|                |      |                |      |                |
|  Cliente Web   | <--> |  Servidor Go   | <--> |   PostgreSQL   |
|    (Next.js)   |      |   (API REST)   |      |                |
|                |      |                |      |                |
+----------------+      +----------------+      +----------------+
```

## Requisitos del Sistema

### Para desarrollo

- Go 1.24.3 o superior
- Node.js 18.x o superior
- npm 9.x o superior
- PostgreSQL 14.x o superior

### Para producción

- Servidor con sistema operativo compatible (Linux, Windows Server)
- PostgreSQL 14.x o superior
- Servidor web (opcional, para proxy inverso)

## Instalación

### Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/SGI-GO.git
cd SGI-GO
```

### Configurar el Backend (Go)

```bash
cd server
go mod download
go build -o sgi-go.exe
```

### Configurar el Frontend (Next.js)

```bash
cd client
npm install
npm run build
```

## Configuración

### Configuración de la Base de Datos

1. Crear una base de datos PostgreSQL para el proyecto.
2. Configurar las credenciales de la base de datos en el archivo de configuración del servidor.

### Configuración del Servidor

Editar el archivo `server/config/config.go` con los parámetros adecuados:

- Conexión a la base de datos
- Puerto del servidor
- Configuración de JWT
- Rutas de almacenamiento de archivos

### Configuración del Cliente

Editar el archivo `.env.local` en la carpeta `client` para configurar:

- URL de la API
- Otras variables de entorno necesarias

## Uso del Sistema

### Iniciar los Servicios

Para iniciar tanto el backend como el frontend, puede utilizar el script de inicio proporcionado:

1. Copie el archivo `start-services-example.bat` a `start-services.bat`
2. Edite el archivo para ajustar las rutas según su entorno
3. Ejecute el script

```bash
start-services.bat
```

Alternativamente, puede iniciar los servicios manualmente:

**Backend:**
```bash
cd server
./sgi-go.exe
```

**Frontend:**
```bash
cd client
npm run start
```

### Acceso al Sistema

Una vez iniciados los servicios, puede acceder al sistema a través de su navegador web:

- Frontend: [http://localhost:3000](http://localhost:3000)
- API Backend: [http://localhost:8080](http://localhost:8080)

## Funcionalidades

### Gestión de Usuarios

- Registro de nuevos usuarios
- Inicio de sesión
- Gestión de roles (admin, moderador, usuario)
- Cambio de contraseña

### Gestión de Informes

- Creación de informes
- Edición de informes existentes
- Visualización detallada de informes
- Filtrado y búsqueda de informes
- Clasificación por estado (completados/no completados)

### Gestión de Personas

- Registro de personas
- Búsqueda de personas
- Vinculación de personas a informes

### Otras Funcionalidades

- Sistema de notificaciones
- Carga y gestión de archivos adjuntos
- Interfaz adaptativa para dispositivos móviles
- Tema claro/oscuro

## Estructura del Proyecto

### Backend (Go)

```
server/
├── auth/               # Autenticación y autorización
├── config/             # Configuración del servidor
├── database/           # Conexión a la base de datos
├── department/         # Controladores y servicios para departamentos
├── entities/           # Modelos de datos
├── files/              # Gestión de archivos
├── locality/           # Controladores y servicios para localidades
├── middlewares/        # Middlewares de la aplicación
├── persons/            # Controladores y servicios para personas
├── reports/            # Controladores y servicios para informes
├── typeReport/         # Controladores y servicios para tipos de informes
├── users/              # Controladores y servicios para usuarios
├── utils/              # Utilidades generales
└── main.go             # Punto de entrada de la aplicación
```

### Frontend (Next.js)

```
client/
├── components/         # Componentes reutilizables
├── hooks/              # Hooks personalizados
├── public/             # Archivos estáticos
└── src/
    └── app/            # Páginas de la aplicación
        ├── home/       # Página de inicio
        ├── login/      # Página de inicio de sesión
        ├── persons/    # Páginas relacionadas con personas
        ├── reports/    # Páginas relacionadas con informes
        └── users/      # Páginas relacionadas con usuarios
```

## API y Endpoints

El backend proporciona una API RESTful con los siguientes endpoints principales:

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario

### Usuarios

- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Informes

- `GET /api/reports` - Obtener todos los informes
- `GET /api/reports/:id` - Obtener informe por ID
- `POST /api/reports` - Crear nuevo informe
- `PUT /api/reports/:id` - Actualizar informe
- `DELETE /api/reports/:id` - Eliminar informe

### Personas

- `GET /api/persons` - Obtener todas las personas
- `GET /api/persons/:id` - Obtener persona por ID
- `POST /api/persons` - Crear nueva persona
- `PUT /api/persons/:id` - Actualizar persona
- `DELETE /api/persons/:id` - Eliminar persona

## Mantenimiento

### Respaldo de la Base de Datos

Se recomienda realizar respaldos periódicos de la base de datos PostgreSQL:

```bash
pg_dump -U usuario -d sgi_go > backup_sgi_go_$(date +%Y%m%d).sql
```

### Actualización del Sistema

Para actualizar el sistema a una nueva versión:

1. Detener los servicios en ejecución
2. Realizar un respaldo de la base de datos
3. Actualizar el código fuente (`git pull`)
4. Reconstruir el backend y el frontend
5. Reiniciar los servicios

### Solución de Problemas Comunes

- **Error de conexión a la base de datos**: Verificar credenciales y disponibilidad del servidor PostgreSQL
- **Error al iniciar el servidor Go**: Verificar que el puerto no esté en uso y que las dependencias estén instaladas
- **Error al iniciar el cliente Next.js**: Verificar que Node.js esté instalado correctamente y que las dependencias estén actualizadas

---

© 2023 Sistema de Gestión de Informes (SGI-GO). Todos los derechos reservados.