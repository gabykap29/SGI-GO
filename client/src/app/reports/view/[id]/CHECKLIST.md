# ✅ Checklist de Validación de Migración

## Pre-Migración

### 📋 Preparación
- [ ] He leído el archivo [INDEX.md](./INDEX.md)
- [ ] He revisado el archivo [README.md](./README.md)
- [ ] He entendido la arquitectura en [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ ] Tengo un backup del código original
- [ ] El entorno de desarrollo está funcionando

### 🔍 Verificación de Archivos
- [ ] Todos los componentes existen en `/components`
- [ ] Todos los hooks existen en `/hooks`
- [ ] Las utilidades existen en `/utils`
- [ ] El archivo `page-refactored.js` existe

---

## Durante la Migración

### 🔧 Aplicando Cambios
- [ ] He ejecutado `migrate.ps1 -DryRun` primero
- [ ] He revisado los cambios que se aplicarán
- [ ] He ejecutado `migrate.ps1` sin errores
- [ ] Se ha creado `page-backup.js` automáticamente

### 🚀 Iniciando Aplicación
```bash
npm run dev
```
- [ ] La aplicación inicia sin errores
- [ ] No hay warnings de React en consola
- [ ] No hay errores de importación

---

## Post-Migración - Testing Funcional

### 📄 Carga de Informe
Navega a un informe existente: `/reports/view/[id]`

- [ ] ✅ El informe se carga correctamente
- [ ] ✅ Se muestra el título del informe
- [ ] ✅ Se muestra la información básica (ubicación, fecha, tipo, estado)
- [ ] ✅ Se muestra el contenido del informe
- [ ] ✅ Se muestran las observaciones (si existen)
- [ ] ✅ No hay errores en consola

### 👤 Información del Usuario
- [ ] ✅ Se muestra el usuario que creó el informe
- [ ] ✅ El avatar/icono se renderiza correctamente

### 📁 Gestión de Archivos

#### Visualización
- [ ] ✅ Se muestran los archivos existentes
- [ ] ✅ Las imágenes se cargan correctamente
- [ ] ✅ Los documentos se listan correctamente
- [ ] ✅ Se muestra el contador de archivos

#### Subida de Archivos
- [ ] ✅ El botón "Agregar" abre el área de subida
- [ ] ✅ Puedo seleccionar archivos desde mi PC
- [ ] ✅ Se validan los tipos de archivo correctamente
- [ ] ✅ Se valida el tamaño de archivo (máx 10MB)
- [ ] ✅ Los archivos seleccionados se listan correctamente
- [ ] ✅ Puedo remover archivos de la lista
- [ ] ✅ El botón "Subir" funciona
- [ ] ✅ Se muestra progreso al subir
- [ ] ✅ Los archivos aparecen después de subir
- [ ] ✅ Se muestra notificación de éxito

#### Eliminación de Archivos
- [ ] ✅ El botón eliminar muestra confirmación
- [ ] ✅ El archivo se elimina correctamente
- [ ] ✅ Se muestra notificación de éxito
- [ ] ✅ El archivo desaparece de la lista

#### Galería de Imágenes
- [ ] ✅ Las imágenes se muestran como miniaturas
- [ ] ✅ Aparece overlay al hacer hover
- [ ] ✅ Se muestra el nombre del archivo
- [ ] ✅ Se muestra el tamaño del archivo
- [ ] ✅ Click en imagen abre modal de visualización
- [ ] ✅ Botón de descarga funciona
- [ ] ✅ Botón de eliminar funciona

#### Visualización de Imagen Ampliada
- [ ] ✅ El modal se abre al hacer click en imagen
- [ ] ✅ La imagen se muestra en tamaño completo
- [ ] ✅ El botón X cierra el modal
- [ ] ✅ Click fuera del modal lo cierra
- [ ] ✅ La imagen no se distorsiona

### 👥 Gestión de Personas

#### Visualización
- [ ] ✅ Se listan las personas vinculadas
- [ ] ✅ Se muestra nombre completo
- [ ] ✅ Se muestra DNI
- [ ] ✅ Se muestra localidad (si existe)
- [ ] ✅ Se muestra contador de personas

#### Agregar Persona
- [ ] ✅ El botón "Agregar" abre el modal
- [ ] ✅ Puedo buscar personas
- [ ] ✅ Puedo seleccionar una persona
- [ ] ✅ La persona se vincula correctamente
- [ ] ✅ No se puede agregar la misma persona dos veces
- [ ] ✅ Se muestra notificación de éxito

#### Ver Detalles de Persona
- [ ] ✅ El botón "Info" abre el modal de detalles
- [ ] ✅ Se muestran todos los datos de la persona
  - [ ] Nombre
  - [ ] Apellido
  - [ ] DNI
  - [ ] Teléfono
  - [ ] Email
  - [ ] Localidad
  - [ ] Provincia
  - [ ] Dirección
- [ ] ✅ El botón "Cerrar" funciona

#### Desvincular Persona
- [ ] ✅ El botón "X" funciona
- [ ] ✅ La persona se desvincula correctamente
- [ ] ✅ Se muestra notificación de éxito
- [ ] ✅ La persona desaparece de la lista

### ✏️ Edición de Informe

#### Abrir Modal
- [ ] ✅ El botón "Editar" abre el modal
- [ ] ✅ Se cargan los valores actuales
- [ ] ✅ El select de estado funciona
- [ ] ✅ El textarea de observaciones funciona

#### Cambiar Estado
- [ ] ✅ Puedo seleccionar "Pendiente"
- [ ] ✅ Puedo seleccionar "Completado"
- [ ] ✅ Puedo seleccionar "Urgente"
- [ ] ✅ El cambio se guarda correctamente
- [ ] ✅ Se actualiza la vista sin recargar
- [ ] ✅ Se muestra notificación de éxito

#### Cambiar Descripción
- [ ] ✅ Puedo editar el texto
- [ ] ✅ El cambio se guarda correctamente
- [ ] ✅ Se actualiza la vista sin recargar
- [ ] ✅ Se muestra notificación de éxito

#### Cambiar Ambos
- [ ] ✅ Puedo cambiar estado y descripción juntos
- [ ] ✅ Ambos cambios se guardan
- [ ] ✅ Se actualiza correctamente

#### Cancelar Edición
- [ ] ✅ El botón "Cancelar" cierra el modal
- [ ] ✅ No se guardan cambios al cancelar
- [ ] ✅ El botón X cierra el modal

### 🎨 Interfaz de Usuario

#### Modo Oscuro
- [ ] ✅ El toggle de tema funciona
- [ ] ✅ Todos los componentes respetan el tema
- [ ] ✅ Los modales respetan el tema
- [ ] ✅ Las tarjetas respetan el tema
- [ ] ✅ No hay problemas de contraste

#### Responsive Design
Probar en diferentes tamaños de pantalla:

**Desktop (>1200px)**
- [ ] ✅ Layout de 2 columnas funciona
- [ ] ✅ Sidebar expandido se ve bien
- [ ] ✅ Sidebar colapsado se ve bien

**Tablet (768px - 1199px)**
- [ ] ✅ Layout se adapta correctamente
- [ ] ✅ Los elementos se reorganizan bien

**Mobile (<768px)**
- [ ] ✅ Layout de 1 columna funciona
- [ ] ✅ Sidebar se colapsa automáticamente
- [ ] ✅ Los botones son táctiles
- [ ] ✅ Los modales funcionan correctamente
- [ ] ✅ Las imágenes se adaptan

#### Navegación
- [ ] ✅ El botón "Volver a Informes" funciona
- [ ] ✅ La navegación del breadcrumb funciona
- [ ] ✅ No hay errores de routing

### 🔐 Autenticación
- [ ] ✅ Sin autenticación, redirige a login
- [ ] ✅ Con autenticación, muestra contenido
- [ ] ✅ El loading state se muestra correctamente

### ⚡ Performance

#### Tiempos de Carga
- [ ] ✅ El informe carga en < 2 segundos
- [ ] ✅ Las imágenes cargan progresivamente
- [ ] ✅ No hay lag al interactuar

#### Memoria
- [ ] ✅ No hay memory leaks evidentes
- [ ] ✅ Los modales se limpian al cerrar

### 🐛 Manejo de Errores

#### Errores de Red
- [ ] ✅ Se muestra mensaje si falla carga de informe
- [ ] ✅ Se muestra mensaje si falla subida de archivo
- [ ] ✅ Se muestra mensaje si falla vinculación de persona

#### Estados Vacíos
- [ ] ✅ "No hay archivos adjuntos" se muestra correctamente
- [ ] ✅ "No hay personas vinculadas" se muestra correctamente
- [ ] ✅ "Informe no encontrado" se muestra si ID inválido

#### Validaciones
- [ ] ✅ No se pueden subir archivos inválidos
- [ ] ✅ No se pueden subir archivos muy grandes
- [ ] ✅ No se puede agregar persona duplicada

---

## Validación Técnica

### 🔍 Código

#### Consola del Navegador
- [ ] ✅ Sin errores en consola
- [ ] ✅ Sin warnings de React
- [ ] ✅ Sin warnings de deprecación

#### Network Tab
- [ ] ✅ Las requests se completan exitosamente
- [ ] ✅ Los headers de autenticación están presentes
- [ ] ✅ Los archivos se descargan correctamente

#### React DevTools
- [ ] ✅ La jerarquía de componentes es limpia
- [ ] ✅ No hay re-renders innecesarios
- [ ] ✅ Los props se pasan correctamente

### 📦 Build

```bash
npm run build
```

- [ ] ✅ El build se completa sin errores
- [ ] ✅ No hay warnings críticos
- [ ] ✅ El tamaño del bundle es razonable

---

## Comparación con Versión Original

### Funcionalidades
- [ ] ✅ Todas las funcionalidades originales funcionan
- [ ] ✅ No se perdió ninguna feature
- [ ] ✅ La UX es igual o mejor

### Bugs Conocidos
- [ ] ✅ Los bugs de la versión original están corregidos
- [ ] ✅ No se introdujeron bugs nuevos

---

## Checklist de Rollback (Si algo falla)

### 🔙 Revertir Cambios

```powershell
.\migrate.ps1 -Rollback
```

- [ ] Ejecuté el script de rollback
- [ ] Se restauró la versión original
- [ ] La aplicación funciona con versión original
- [ ] Documenté el problema encontrado

### 📝 Reportar Problema
Si necesitas hacer rollback, documenta:

1. **¿Qué funcionalidad falló?**
   - Descripción:
   
2. **¿Cómo reproducir el error?**
   - Pasos:
   
3. **¿Qué mensaje de error apareció?**
   - Error:
   
4. **¿En qué navegador/dispositivo?**
   - Navegador:
   - Versión:
   - Dispositivo:

---

## ✅ Aprobación Final

### Firma de Validación

Habiendo completado todos los checks anteriores:

- [ ] ✅ Todas las funcionalidades críticas funcionan
- [ ] ✅ No hay errores bloqueantes
- [ ] ✅ La performance es aceptable
- [ ] ✅ La UX es igual o mejor que antes
- [ ] ✅ Estoy satisfecho con la migración

**Validado por**: _________________  
**Fecha**: _________________  
**Versión probada**: page-refactored.js  
**Estado**: ✅ APROBADO / ⚠️ PENDIENTE / ❌ RECHAZADO

---

## 📊 Reporte Final

### Resultado General
```
Total de checks: ~XXX
Checks pasados: XXX
Checks fallidos: XXX
Porcentaje de éxito: XX%
```

### Notas Adicionales
- 
- 
- 

### Decisión
- [ ] ✅ **MIGRACIÓN APROBADA** - Mantener versión refactorizada
- [ ] ⚠️ **MIGRACIÓN PENDIENTE** - Se requieren ajustes
- [ ] ❌ **ROLLBACK NECESARIO** - Volver a versión original

---

**Última actualización**: $(Get-Date -Format "yyyy-MM-dd HH:mm")
