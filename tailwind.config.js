module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(28, 40%, 30%)",
        secondary: "hsl(38, 26%, 90%)",
        tertiary: "hsl(42, 26%, 80%)",
        quaternary: "hsl(42, 26%, 60%)",
        darker: "hsl(42, 26%, 10%)",
      },
    },
  },
  plugins: [],
};
