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
        dark: "hsl(205, 32%, 16%)",
        darker: "hsl(192, 58%, 8%)",
        darklight: "hsl(212, 24%, 30%)",
        lightsquare: "hsl(209, 22%, 88%)",
        darksquare: "hsl(209, 20%, 65%)",
        description: "hsl(0, 0%, 68%)",
        contrast: "#EEEEEE",
        complementary: "hsl(22, 70%, 56%)",
      },
      screens: {
        560: "560px",
        500: "500px",
        440: "440px",
        360: "360px",
        320: "320px",
      },
      keyframes: {
        hover: {
          "0%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(8px)",
          },
          "100%": {
            transform: "translateY(0px)",
          },
        },
      },
    },
  },
  plugins: [],
};

// Dark and modalbg the same
