/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // Usar o novo pacote aqui
    autoprefixer: {},
  },
};

export default config;
