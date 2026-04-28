# Learnix - Plataforma educativa mejorada

Proyecto frontend desarrollado con React, TypeScript y Vite. La aplicación simula una plataforma de cursos online con catálogo, rutas de aprendizaje, planes, blog, clases en vivo, empresas y formularios principales.

## Mejoras realizadas

- Home conservado visualmente como en la versión anterior.
- Catálogo de cursos con búsqueda, filtros, ordenamiento, favoritos, temario e inscripción simulada.
- Rutas recomendadas por objetivo de aprendizaje.
- Formulario de orientación académica.
- Apartado empresas con proceso, módulos corporativos y formulario comercial.
- Blog con buscador, filtro por categoría y formulario de newsletter.
- Clases en vivo con agenda, reserva directa y formulario de inscripción.
- Planes con tabla comparativa, FAQ y formulario de solicitud de plan.
- Canales de pago interactivos: tarjeta, Yape/Plin, transferencia, PayPal y factura empresarial.
- Panel de pago que se abre según el canal seleccionado.
- Botón para abrir WhatsApp con mensaje de comprobante.
- Botón externo para abrir PayPal en una nueva pestaña.
- Opción para copiar datos bancarios de prueba.
- Login mejorado con inicio de sesión, registro y recuperación de contraseña.
- Datos separados en archivos dentro de `src/data`.
- Tipos centrales definidos en `src/types.ts`.
- Componentes reutilizables en `src/components`.

## Formularios incluidos

- Formulario de inscripción a curso.
- Formulario de recomendación de cursos.
- Formulario corporativo para empresas.
- Formulario de reserva de clase en vivo.
- Formulario de newsletter.
- Formulario de solicitud de plan.
- Formulario simulado de pago con tarjeta.
- Formulario de solicitud empresarial con facturación.
- Formulario de login.
- Formulario de registro.
- Formulario de recuperación de contraseña.

## Ejecutar el proyecto

```bash
npm install
npm run dev
```

## Compilar

```bash
npm run build
```

> Nota: los formularios son visuales y simulan el envío. Para una versión real se debería conectar con un backend, base de datos, autenticación y pasarela de pago.
