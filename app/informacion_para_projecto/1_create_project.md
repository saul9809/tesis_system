# Crear Next.js 15

npx create-next-app@latest rrhh-classifier --ts --eslint --tailwind

cd rrhh-classifier

# Drizzle + PG

npm i drizzle-orm pg dotenv

# shadcn/ui + tailwind (si no lo tienes)

npm i -D tailwindcss postcss autoprefixer
npx shadcn-ui@latest init

# Componentes shadcn que usaremos

npx shadcn-ui@latest add sheet button input label checkbox badge toast

# Procesamiento PDF y OCR opcional

npm i pdf-parse

# OCR opcional: no es npm, instala en VPS:

# sudo apt-get update && sudo apt-get install -y poppler-utils tesseract-ocr

# Exportación a PDF

npm i pdfmake

---

# Al inicializar drizzel se debe configurar el archivo env

DATABASE_URL=postgres://user:pass@host:5432/dbname

- Instrucciones con drizzel\*\*

Inicializa Drizzle (/db/index.ts) y define el schema (/drizzle/schema.ts) con candidates, param_definitions, filter_presets.

- Drizzel kit y Migraciones\*\*

npm i -D drizzle-kit

- Configura drizzle.config.ts y luego: \*\*

npx drizzle-kit generate
npx drizzle-kit push

# Helpers de extracción y clasificación

/lib/resume.ts: heurísticas (email, teléfono, años exp, specialty), buildTextIndex.
/lib/normalize.ts: normalizar municipio/provincia (Marianao, La Habana).
/lib/param-map.ts: mapeo key:value → FilterParams con sinónimos y parseo de rangoEdad.
/lib/classifier.ts: scoring (posición, especialidad, depto, geo, skills, años, edad, tokens libres).
