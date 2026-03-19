import os

IGNORAR_DIRS = {
    "node_modules", ".git", "dist", "build", ".vite",
    "__pycache__", ".cache", "coverage"
}

IGNORAR_ARCHIVOS = {
    "package-lock.json", "yarn.lock", ".gitignore",
    "vite.config.js", "vite.config.ts", "eslint.config.js",
    ".eslintrc", ".eslintrc.js", ".prettierrc",
    "README.md", "index.html", "main.jsx", "main.tsx",
    "App.css", "index.css"
}

EXTENSIONES_VALIDAS = {".jsx", ".tsx", ".js", ".ts", ".json"}

def mostrar_arbol(ruta, prefijo="", es_ultimo=True):
    nombre = os.path.basename(ruta)

    conector = "└── " if es_ultimo else "├── "
    print(prefijo + conector + nombre)

    prefijo_hijo = prefijo + ("    " if es_ultimo else "│   ")

    if os.path.isdir(ruta):
        try:
            entradas = sorted(os.listdir(ruta))
        except PermissionError:
            return

        entradas = [
            e for e in entradas
            if e not in IGNORAR_DIRS and e not in IGNORAR_ARCHIVOS
            and (
                os.path.isdir(os.path.join(ruta, e))
                or os.path.splitext(e)[1] in EXTENSIONES_VALIDAS
            )
        ]

        for i, entrada in enumerate(entradas):
            es_ult = (i == len(entradas) - 1)
            mostrar_arbol(os.path.join(ruta, entrada), prefijo_hijo, es_ult)

def main():
    ruta = input("Ruta del proyecto (Enter para directorio actual): ").strip()
    if not ruta:
        ruta = "."
    ruta = os.path.abspath(ruta)
    print(f"\n📁 {ruta}\n")
    mostrar_arbol(ruta)

if __name__ == "__main__":
    main()