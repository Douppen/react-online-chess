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
        darker: "hsl(192, 61%, 9%)",
        complementary: "hsl(20, 77%, 56%)",
        dark: "hsl(202, 41%, 15%)",
        darksquare: "hsl(209, 20%, 65%)",
        ligthsquare: "hsl(209, 22%, 88%)",
        description: "hsl(0, 0%, 68%)",
        contrast: "#FFFFFF",
        bottomgradient: "hsl(227, 51%, 16%)",
        topgradient: "hsl(227, 21%, 30%)",
      },
    },
  },
  plugins: [],
};
