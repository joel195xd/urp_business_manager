# 📋 Guía de Instalación y Uso: URP Masterjob Admin

¡Bienvenido al Panel de Administración de Negocios! Este script es una extensión potente y visualmente atractiva para `origen_masterjob`, diseñada para que los administradores gestionen la economía empresarial del servidor de forma sencilla.

---

## 🚀 Paso 1: Instalación

Para instalar el script correctamente, sigue estos pasos:

1. **Descarga**: Asegúrate de tener la carpeta `urp_masterjob_admin` completa.
2. **Ubicación**: Sube la carpeta a tu directorio de `resources` de FiveM.
3. **Registro**: Abre tu archivo `server.cfg` y añade la siguiente línea:
   ```cfg
   ensure urp_masterjob_admin
   ```
4. **Dependencias**: El script requiere que tengas instalados y funcionando:
   - `qb-core`
   - `origen_masterjob`
---

## ⚙️ Paso 2: Configuración Personalizada

Antes de iniciar el servidor, abre el archivo `config.lua` para ajustar el script a tus necesidades:

- **Idioma (`Config.Locale`)**: Puedes elegir entre `'es'` (Español) o `'en'` (Inglés).
- **Grupos Administrativos (`Config.AdminGroups`)**: Define qué rangos de QBCore pueden abrir el panel (por defecto: `admin` y `god`).
- **Comando (`Config.OpenCommand`)**: Cambia el comando por defecto (`/adminnegocios`) si prefieres otro.

---

## 🛠️ Paso 3: Cómo Usar el Panel

Una vez dentro del servidor y con los permisos adecuados, sigue este tutorial de uso:

### 1. Abrir el Panel
Escribe el comando en el chat:
```
/adminnegocios
```
Se abrirá una interfaz.

### 2. Buscar un Negocio
En la esquina superior derecha verás un buscador. Simplemente escribe el nombre del negocio o su ID para filtrar la lista instantáneamente.

### 3. Verificar Estado
Cada tarjeta de negocio muestra un indicador:
- **VERDE (ABIERTO)**: Hay empleados trabajando en ese momento.
- **ROJO (CERRADO)**: No hay nadie de servicio.

### 4. Editar el Nombre
Haz clic en el botón **EDITAR**. Aparecerá una ventana para que introduzcas el nuevo nombre comercial. Los cambios se guardan automáticamente en la base de datos de `origen_masterjob`.

### 5. Eliminar un Negocio
Si necesitas borrar un negocio por completo, usa el botón **ELIMINAR**. El sistema te pedirá confirmación y luego ejecutará la limpieza total del negocio, incluyendo sus datos internos.

---

## ❓ Preguntas Frecuentes

**¿Dónde se guardan los nombres editados?**  
Se guardan directamente en la tabla `origen_masterjob` de la propia script.

**¿Puedo añadir más idiomas?**  
Sí, simplemente añade una entrada nueva en `locales.lua` siguiendo el formato existente.
---