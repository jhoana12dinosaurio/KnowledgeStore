# KnowledgeStore - Estructura del Proyecto

## 📁 Estructura de Carpetas

```
src/
├── components/        # Componentes reutilizables
│   ├── StarRating.tsx
│   ├── CourseCard.tsx
│   ├── CheckIcon.tsx
│   ├── ArrowRight.tsx
│   ├── AlliedCompanyCard.tsx
│   └── index.ts       # Re-exporta todos los componentes
├── data/              # Datos y constantes
│   ├── courses.ts     # Todos los datos (cursos, categorías, niveles, etc.)
│   └── index.ts       # Re-exporta los datos
├── pages/             # Páginas principales
│   └── App.tsx        # Componente principal con toda la lógica
├── styles/            # Estilos CSS
│   └── App.css        # Estilos globales
├── assets/            # Imágenes y recursos estáticos
├── utils/             # Funciones utilitarias (vacío para usar en futuro)
├── index.css          # Estilos base
└── main.tsx           # Punto de entrada de React
```

## 🎯 Propósito de Cada Carpeta

### `components/`
Contiene componentes React reutilizables:
- **StarRating**: Componente para mostrar calificaciones de estrellas
- **CourseCard**: Tarjeta de curso con información básica (clickeable)
- **CheckIcon**: Icono de verificación para listas
- **ArrowRight**: Icono de flecha derecha
- **AlliedCompanyCard**: Tarjeta de empresa aliada con efecto hover

### `data/`
Contiene todas las constantes y datos de la aplicación:
- Catálogo de cursos (32 cursos)
- Categorías disponibles
- Niveles de dificultad
- Estadísticas
- Planes de membresía
- Empresas aliadas
- Beneficios

### `pages/`
Contiene las páginas principales de la aplicación:
- **App.tsx**: Gestiona todo el estado y la lógica de navegación incluyendo:
  - Vista de inicio (hero, categorías, membresías)
  - Catálogo de cursos con filtros
  - Página de empresas aliadas
  - Modal de detalle de curso

### `styles/`
Contiene los estilos CSS:
- Diseño responsivo
- Variables CSS personalizadas
- Estilos para todos los componentes
- Estilos para el modal de detalle de curso

## ✨ Características Principales

### Filtros de Cursos
- **Filtro por Categoría**: 8 categorías disponibles
- **Filtro por Nivel**: Principiante, Intermedio, Avanzado
- **Búsqueda por Título**: Búsqueda en tiempo real

### Detalle de Curso
Al hacer clic en un curso, se abre un modal que muestra:
- Imagen y categoría del curso
- Título, instructor y calificación
- Duración, nivel y precio
- ¿Qué aprenderás? (grid de 4 items)
- Contenido del curso (módulos)
- Qué incluye (lista de características)
- Requisitos previos
- Información del instructor

### Secciones Principales
1. **Hero**: Introducción con buscador de cursos
2. **Cursos Destacados**: Grid de 6 cursos destacados
3. **Categorías**: Grid de 7 categorías
4. **Planes de Membresía**: 3 planes (Básico, Pro, Empresas)
5. **Empresas Aliadas**: Grid de 12 empresas tecnológicas
6. **Catálogo Completo**: Vista de todos los cursos con filtros

## 🚀 Mejoras Implementadas

✅ **Estructura organizada**: Separación clara de componentes, datos y páginas  
✅ **Componentes reutilizables**: Cada componente tiene una responsabilidad única  
✅ **Datos centralizados**: Todos los datos en una carpeta dedicated  
✅ **Re-exportación**: Archivos index.ts para imports más limpios  
✅ **Detalle de curso**: Modal completamente funcional con toda la información  
✅ **Filtros avanzados**: Filtro por nivel + categoría + búsqueda  
✅ **Responsive Design**: Diseño adaptativamente responsivo  
✅ **CSS Grid**: Layout moderno con CSS Grid y Flexbox

## 🛠️ Cómo Importar Componentes

```typescript
// Opción 1: Imports limpios usando index.ts
import { CourseCard, StarRating } from '../components';
import { allCourses, categories } from '../data';

// Opción 2: Imports específicos
import { CourseCard } from '../components/CourseCard';
import { allCourses } from '../data/courses';
```

## 📱 Responsividad

El proyecto es completamente responsivo con breakpoints en:
- Escritorio (1024px+)
- Tablet (768px - 1024px)
- Móvil (640px - 768px)

## 🎨 Paleta de Colores

- **Primario**: #00c896 (Verde Teal)
- **Secundario**: #6366F1 (Índigo)
- **Fondo**: #06090f (Casi negro)
- **Texto**: #eef2ff (Blanco grisáceo)
- **Dorado**: #f4b942 (Para estrellas)

## 📦 Dependencias Principales

- React 18+
- TypeScript
- Vite (bundler)

---

**Últimas actualizaciones**: Refactoring de estructura y adición de modal de detalle de curso
