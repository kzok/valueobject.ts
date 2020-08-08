module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "consistent",
  trailingComma: "all",
  bracketSpacing: false,
  arrowParens: "avoid",
  overrides: [
    {
      files: "*.md",
      options: {
        tabWidth: 4,
        printWidth: 120,
      },
    },
  ],
};
