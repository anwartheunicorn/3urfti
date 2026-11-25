// '3urfti brand colours. Tailwind reads this and creates classes like
// bg-brand-600 (teal) and bg-sand-100 (warm sand) that every page can use.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effaf8", 100: "#d7f2ec", 200: "#b0e4da", 300: "#7fcfc1", 400: "#4bb3a4",
          500: "#2c968a", 600: "#1f7870", 700: "#1c605b", 800: "#1a4d4a", 900: "#183f3d", 950: "#082524",
        },
        sand: {
          50: "#fdf9f2", 100: "#f8eedb", 200: "#f1dbb3", 300: "#e8c282", 400: "#dfa552",
          500: "#d68b31", 600: "#be6f26", 700: "#9e5423", 800: "#814423", 900: "#6a391f",
        },
      },
      fontFamily: {
        sans: ["Inter", "Cairo", "system-ui", "sans-serif"],
      },
    },
  },
};
