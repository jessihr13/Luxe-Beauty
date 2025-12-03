# Luxe Beauty - Guía de Mantenimiento

Esta guía te ayudará a mantener y actualizar tu plataforma de e-commerce sin necesidad de conocimientos técnicos avanzados.

## 📋 Tabla de Contenidos

1. [Instalación Inicial](#instalación-inicial)
2. [Cómo Reemplazar Imágenes](#cómo-reemplazar-imágenes)
3. [Cómo Editar Textos](#cómo-editar-textos)
4. [Cómo Añadir Nuevos Productos](#cómo-añadir-nuevos-productos)
5. [Gestión de Usuarios y Roles](#gestión-de-usuarios-y-roles)
6. [Solución de Problemas](#solución-de-problemas)
7. [Despliegue](#despliegue)

---

## 🚀 Instalación Inicial

### Requisitos Previos

Antes de comenzar, necesitas instalar:

1. **Node.js** (versión 18 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica la instalación: `node --version`

2. **Editor de Código** (opcional pero recomendado)
   - Visual Studio Code: https://code.visualstudio.com/

### Pasos de Instalación

1. Abre una terminal en la carpeta del proyecto:
   ```bash
   cd "d:\Users\josep\OneDrive\Desktop\Pagina web maquillaje"
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador en: `http://localhost:3000`

---

## 🖼️ Cómo Reemplazar Imágenes

### Método 1: Usando el CMS Visual (Recomendado)

1. Accede al panel de administración: `http://localhost:3000/admin/dashboard`
2. Ve a la sección **"Contenido"** en el menú lateral
3. Haz clic en el bloque que quieres editar
4. En el campo **"URL de Imagen"**, pega la nueva URL de tu imagen
5. Haz clic en **"Guardar"** y luego en **"Guardar Cambios"**

### Método 2: Editando el Código

#### Para el Hero Section:

1. Abre el archivo: `components/customer/HeroSection.tsx`
2. Busca la línea que contiene `src="https://images.unsplash.com/..."`
3. Reemplaza la URL con tu nueva imagen
4. Guarda el archivo (los cambios se reflejarán automáticamente)

#### Para Productos:

1. Abre el archivo: `lib/data/products.ts`
2. Busca el producto que quieres editar
3. En el array `images`, reemplaza las URLs:
   ```typescript
   images: [
     'https://tu-nueva-imagen-1.jpg',
     'https://tu-nueva-imagen-2.jpg',
   ],
   ```
4. Guarda el archivo

### Fuentes de Imágenes Recomendadas

- **Unsplash**: https://unsplash.com/ (gratis, alta calidad)
- **Pexels**: https://pexels.com/ (gratis)
- **Tu propio servidor**: Sube imágenes a tu hosting

---

## ✏️ Cómo Editar Textos

### Textos del Hero Section

**Archivo**: `components/customer/HeroSection.tsx`

```typescript
// Título principal
<h1>
  Transforma Tu{' '}
  <span className="gradient-text">
    Radiancia Natural  {/* ← Edita aquí */}
  </span>
</h1>

// Subtítulo
<p>
  Descubre cosméticos de lujo...  {/* ← Edita aquí */}
</p>

// Texto del botón
<button>
  Descubre Tu Brillo ✨  {/* ← Edita aquí */}
</button>
```

### Textos de Productos

**Archivo**: `lib/data/products.ts`

```typescript
{
  name: 'Radiance Renewal Serum',  // ← Nombre del producto
  shortDescription: 'Suero iluminador...',  // ← Descripción corta
  description: 'Transforma tu piel...',  // ← Descripción completa
  price: 89.99,  // ← Precio
  // ...
}
```

### Textos del Footer

**Archivo**: `app/page.tsx` (busca la sección `<footer>`)

---

## 🛍️ Cómo Añadir Nuevos Productos

1. Abre el archivo: `lib/data/products.ts`

2. Copia un producto existente y pégalo al final del array

3. Modifica los valores:

```typescript
{
  id: 'prod_007',  // ← ID único
  name: 'Nombre de Tu Producto',
  shortDescription: 'Descripción breve',
  description: 'Descripción detallada del producto...',
  price: 99.99,
  originalPrice: 129.99,  // Opcional (para mostrar descuento)
  category: 'skincare',  // 'skincare', 'makeup', o 'fragrance'
  subcategory: 'Serums',
  images: [
    'https://url-de-tu-imagen-1.jpg',
    'https://url-de-tu-imagen-2.jpg',
  ],
  stock: 50,  // Cantidad disponible
  rating: 4.8,  // Calificación (0-5)
  reviewCount: 100,  // Número de reseñas
  ingredients: ['Ingrediente 1', 'Ingrediente 2'],
  benefits: ['Beneficio 1', 'Beneficio 2'],
  skinTypes: ['Normal', 'Seca', 'Mixta'],
  neuromarketing: {
    scarcityLevel: 'low',  // 'high', 'medium', 'low', 'none'
    isBestseller: false,
    isTrending: true,
    isNew: true,
    socialProof: {
      purchaseCount: 0,
      viewingNow: 0,
    },
  },
},
```

4. Guarda el archivo

---

## 👥 Gestión de Usuarios y Roles

### Roles Disponibles

1. **Admin** (Administrador)
   - Acceso total a todas las funciones
   - Puede ver métricas financieras
   - Gestiona usuarios

2. **Logistics** (Logística)
   - Solo ve pedidos y direcciones de envío
   - No puede editar contenido

3. **Marketing**
   - Puede editar banners, ofertas y cupones
   - Acceso a analíticas
   - No ve información financiera sensible

### Cambiar el Rol de un Usuario

**Archivo**: `lib/auth/rbac.ts`

```typescript
export function getCurrentUser(): User {
  return {
    id: 'user_001',
    name: 'Nombre del Usuario',
    email: 'email@ejemplo.com',
    role: UserRole.ADMIN,  // ← Cambia aquí: ADMIN, LOGISTICS, MARKETING
  };
}
```

---

## 🔧 Solución de Problemas

### El sitio no carga

1. Verifica que el servidor esté corriendo: `npm run dev`
2. Revisa que no haya errores en la terminal
3. Intenta reiniciar el servidor (Ctrl+C y luego `npm run dev`)

### Las imágenes no se muestran

1. Verifica que la URL de la imagen sea correcta
2. Asegúrate de que la imagen sea accesible públicamente
3. Revisa la consola del navegador (F12) para ver errores

### Los cambios no se reflejan

1. Guarda el archivo (Ctrl+S)
2. Espera unos segundos para que Next.js recargue
3. Refresca el navegador (F5)
4. Si persiste, reinicia el servidor

### Error de compilación

1. Revisa que no falten comas o llaves en el código
2. Verifica que las comillas estén cerradas correctamente
3. Consulta el mensaje de error en la terminal

---

## 🌐 Despliegue

### Opción 1: Vercel (Recomendado - Gratis)

1. Crea una cuenta en https://vercel.com
2. Conecta tu repositorio de GitHub
3. Haz clic en "Deploy"
4. ¡Listo! Tu sitio estará en línea

### Opción 2: Netlify

1. Crea una cuenta en https://netlify.com
2. Arrastra la carpeta del proyecto
3. Configura el comando de build: `npm run build`
4. Despliega

### Antes de Desplegar

1. Construye el proyecto para verificar errores:
   ```bash
   npm run build
   ```

2. Si hay errores, corrígelos antes de desplegar

3. Actualiza las URLs de imágenes a URLs permanentes (no localhost)

---

## 📞 Soporte

Si necesitas ayuda adicional:

1. Revisa la documentación de Next.js: https://nextjs.org/docs
2. Consulta la comunidad de Next.js en Discord
3. Busca tutoriales en YouTube sobre Next.js 14

---

## 🎨 Personalización Avanzada

### Cambiar Colores

**Archivo**: `tailwind.config.ts`

Busca la sección `colors` y modifica los valores hexadecimales:

```typescript
'rose-gold': {
  300: '#E8C4B8',  // ← Color principal
  // ...
},
```

### Cambiar Fuentes

**Archivo**: `app/globals.css`

Reemplaza las URLs de Google Fonts en la primera línea.

---

**¡Felicidades!** Ahora tienes todo lo necesario para mantener tu plataforma de e-commerce. 🎉
