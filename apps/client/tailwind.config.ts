import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Mapeamento das nossas variáveis CSS para o tema do Tailwind
                "primary-bg": "#121212",
                "surface": "#1e1e1e",
                "primary": "#bb86fc",
                "primary-variant": "#3700b3",
                "secondary": "#03dac6",
                "text-primary": "#e1e1e1",
                "text-secondary": "#a8a8a8",
                "border-color": "#333333",
            },
            fontFamily: {
                sans: ["Segoe UI", "Roboto", "Oxygen", "Ubuntu", "sans-serif"],
                mono: ["Consolas", "Menlo", "monospace"],
            },
        },
    },
    plugins: [],
};
export default config;