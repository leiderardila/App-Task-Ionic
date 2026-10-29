# Prueba Todo — Ionic + Angular

Lista de tareas con categorías, Firebase Remote Config (feature flag) y soporte para Android e iOS con Capacitor.

## Funcionalidades

- Tareas: agregar, completar, eliminar. Persisten en almacenamiento local (`@capacitor/preferences`).
- Categorías: crear, editar, eliminar, asignar a una tarea y filtrar.
- Feature flag `categories` (Firebase Remote Config): si está en `false` se oculta todo lo relacionado con categorías.

## Estructura

```
src/app/
├── core/
│   ├── models/      task.model.ts, category.model.ts
│   └── services/    task, category, storage, feature-flag
├── pages/           home, tasks, categories
├── shared/components/  task-card, category-filter, empty-state
└── app.routes.ts
src/environments/    configuración de Firebase por entorno
```

## Requisitos

- Node.js >= 22.22.3 (requerido por Angular CLI 22)
- Ionic CLI: `npm i -g @ionic/cli`
- Android: Android Studio + SDK
- iOS: macOS con Xcode y CocoaPods

## Ejecutar en el navegador

```bash
npm install
ionic serve
```

## Configurar Firebase y Remote Config

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com) y registrar una app web.
2. Copiar la configuración en `src/environments/environment.ts` y `environment.prod.ts` (hoy tienen `REEMPLAZAR`).
3. En **Remote Config** crear el parámetro `categories` (Boolean) con valor `true` y publicar.
4. Demostración: poner `categories` en `false`, publicar y reabrir la app. Se ocultan el selector de categoría, el filtro y el acceso a Categorías; la ruta `/categories` redirige a `/home`.

Si Firebase no responde o no está configurado, la app usa el valor por defecto (`true`) y no se bloquea.

## Compilar para Android e iOS (Capacitor)

```bash
ionic build
npx cap add android      # solo la primera vez
npx cap add ios          # solo la primera vez, requiere macOS
npx cap sync
npx cap open android     # abre Android Studio
npx cap open ios         # abre Xcode
```

- **APK:** en Android Studio, *Build > Build Bundle(s) / APK(s) > Build APK(s)*.
- **IPA:** en Xcode, *Product > Archive*, y luego *Distribute App* (requiere cuenta de Apple Developer y firma).
- Sin Mac, el IPA puede generarse con un servicio en la nube (Codemagic, MacStadium, etc.).

## Optimización de rendimiento

- Páginas con carga diferida (`loadComponent`) y precarga de rutas.
- Virtual scroll (`@angular/cdk`) en la lista de tareas: solo se renderizan los elementos visibles.
- Componentes `OnPush` y estado con signals.
- Mapa id → nombre de categoría (`computed`) para evitar búsquedas por cada tarea renderizada.
- Inicio no bloqueante: Remote Config tiene un tope de 3 s.

## Preguntas de la prueba

Pendiente de completar.
