/** @type {import('tailwindcss').Config} */
export default {
  content: ["src/static/index.html"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("daisyui")
  ],
  daisyui: { 
    themes: [
      {
        customdim: {
          ...require("daisyui/src/theming/themes")["dim"],
          primary: "yellow",
          secondary: "aquamarine",
        }
      },
      "dim", "dark", "cupcake"
    ]
  }
}

