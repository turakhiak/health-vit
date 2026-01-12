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
                // Custom colors for premium feel
                brand: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    500: '#0ea5e9', // Sky blue equivalent
                    600: '#0284c7',
                    900: '#0c4a6e',
                },
                accent: {
                    500: '#f59e0b', // Amber for warnings/highlights
                }
            },
        },
    },
    plugins: [],
};
export default config;
