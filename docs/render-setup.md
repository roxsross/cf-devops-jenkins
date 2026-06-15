# Configurar Render como plataforma de deploy

## Requisitos previos

- Cuenta en [render.com](https://render.com) (gratis)
- Repo en GitHub con `Dockerfile` en la raíz
- Acceso a los Secrets del repositorio en GitHub

---

## Paso 1 — Crear el servicio en Render

1. Iniciar sesión en [render.com](https://render.com)
2. Click en **New +** → **Web Service**
3. Seleccionar **Build and deploy from a Git repository** → conectar GitHub
4. Elegir el repo `cf-devops-jenkins`
5. Completar la configuración:

| Campo | Valor |
|---|---|
| Name | `mi-sitio-web` |
| Region | `Oregon (US West)` u otra cercana |
| Branch | `master` |
| Runtime | `Docker` |
| Instance Type | `Free` |

6. Click **Deploy Web Service**

Render hace el primer deploy automático usando el `Dockerfile` del repo.

---

## Paso 2 — Obtener la URL pública

Una vez desplegado, en el dashboard del servicio aparece la URL arriba:

```
https://mi-sitio-web.onrender.com
```

Copiar esa URL — se usa como `RENDER_APP_URL`.

---

## Paso 3 — Crear el Deploy Hook

1. Ir al servicio → **Settings**
2. Scroll hasta la sección **Deploy Hooks**
3. Click **Add Deploy Hook**
4. Darle un nombre (ej: `github-actions`)
5. Copiar la URL generada:

```
https://api.render.com/deploy/srv-XXXXXXXXXXXXXXXX?key=YYYYYYYYYYYYYYYY
```

Esta URL dispara un nuevo deploy cada vez que se la llama con `curl`.

---

## Paso 4 — Agregar Secrets en GitHub

Ir al repo en GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Agregar los dos secrets:

| Secret | Valor |
|---|---|
| `RENDER_DEPLOY_HOOK` | URL del Deploy Hook obtenida en el paso anterior |
| `RENDER_APP_URL` | URL pública del servicio, ej: `https://mi-sitio-web.onrender.com` |

---

## Paso 5 — Verificar el pipeline

Hacer un `push` a `master`. El job `CD · Deploy (Render)` del pipeline:

1. Llama al Deploy Hook via `curl`
2. Render inicia un nuevo deploy con el código actualizado
3. El workflow espera hasta 4 minutos que la URL responda
4. El job `CD · DAST ZAP` apunta ZAP a la URL pública de Render

---

## Comportamiento del free tier

| Característica | Detalle |
|---|---|
| Sleep tras inactividad | La app se duerme después de 15 min sin tráfico |
| Cold start | El primer request tarda ~30-60 segundos en despertar |
| Horas de deploy | Sin restricción horaria (a diferencia de Railway free) |
| Límite mensual | 750 horas de compute por mes |

> El step `Wait for deployment to be live` del workflow tiene 24 reintentos con 10s de espera entre cada uno (4 minutos en total), suficiente para cubrir el cold start.

---

## Diagrama del flujo

```
push a master
      │
      ▼
  init → test
            │
     ┌──────┴───────┐
     │              │
   build       SAST/SCA
  (ghcr.io)   (paralelo)
     │              │
     └──────┬───────┘
            │ (security gate)
            ▼
     deploy (Render)
      curl RENDER_DEPLOY_HOOK
      wait RENDER_APP_URL
            │
            ▼
       dast (ZAP)
      target: RENDER_APP_URL
```
