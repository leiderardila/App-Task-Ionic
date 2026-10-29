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
2. Copiar la configuración de la app web en `src/environments/environment.ts` y `environment.prod.ts`.
3. En **Remote Config** crear el parámetro `categories` (Boolean) con valor `true` y publicar.
4. Demostración: poner `categories` en `false`, publicar y reabrir la app. Se ocultan el selector de categoría, el filtro y el acceso a Categorías; la ruta `/categories` redirige a `/home`.

Si Firebase no responde o no está configurado, la app usa el valor por defecto (`true`) y no se bloquea.

## Compilar para Android e iOS (Capacitor)

> **Capacitor en lugar de Cordova:** la prueba menciona Cordova, pero se usó Capacitor, su sucesor oficial en Ionic. Cumple el mismo objetivo (empaquetar la app web como app nativa para Android e iOS), tiene mantenimiento activo y ya lo usan los plugins del proyecto (`@capacitor/preferences`). Los proyectos nativos quedan en `android/` e `ios/` y se abren con Android Studio y Xcode.

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

### ¿Cuáles fueron los principales desafíos al implementar las nuevas funcionalidades?

- **Compatibilidad de versiones:** `@angular/fire` 21 solo admite Angular 21 y TypeScript menor que 6, mientras que la plantilla de Ionic trae Angular 22. Se resolvió usando el SDK `firebase` directamente, que no depende de la versión de Angular.
- **Almacenamiento asíncrono:** `@capacitor/preferences` es asíncrono, por lo que los servicios arrancan con una lista vacía y cargan los datos en segundo plano. Además, `Date` se serializa como texto en JSON y se restaura al leer.
- **Feature flag sin bloquear el inicio:** Remote Config requiere red. Se carga al arrancar con un tope de 3 s y con valores por defecto, para que la app funcione aunque Firebase falle.
- **Integridad de datos:** al eliminar una categoría, sus tareas quedaban apuntando a un id inexistente. Ahora quedan sin categoría.
- **Herramientas de compilación:** Angular CLI 22 exige Node 22.22.3 o superior, y Capacitor 8 exige JDK 21 para compilar Android.

### ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?

- **Virtual scroll** (`@angular/cdk`): con miles de tareas solo se renderizan las visibles, lo que reduce el DOM y la memoria.
- **Carga diferida de páginas** (`loadComponent`): reduce el tamaño del bundle inicial y acelera el arranque.
- **`ChangeDetectionStrategy.OnPush` y signals:** Angular solo revisa los componentes cuyos datos cambian.
- **`computed` con un mapa id → nombre de categoría:** evita buscar la categoría por cada tarea renderizada.
- **`trackBy`:** reutiliza los elementos del DOM al filtrar o modificar la lista.
- **Inicio con tope de 3 s para Remote Config:** una red lenta no retrasa la pantalla inicial.

### ¿Cómo aseguraste la calidad y mantenibilidad del código?

- **Estructura por responsabilidad:** `core` (modelos y servicios), `pages` y `shared/components`.
- **Componentes standalone, pequeños y reutilizables** (`task-card`, `category-filter`, `empty-state`).
- **Lógica fuera de los componentes:** el acceso a datos, el almacenamiento y los feature flags viven en servicios inyectables.
- **Tipado estricto de TypeScript:** el proyecto compila sin errores con `ng build`.
- **Un único punto de acceso a los flags:** `FeatureFlagService` centraliza los valores por defecto y Remote Config.
- **Comentarios en las decisiones no obvias** y commits pequeños y descriptivos.
- **Pendiente:** no se escribieron pruebas unitarias propias; el proyecto trae la configuración de Vitest y Playwright lista para añadirlas.
