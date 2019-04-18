const {ts, dts} = require("rollup-plugin-dts");
const {terser} = require("rollup-plugin-terser");

module.exports = [
  {
    input: "./src/index.ts",
    output: [
      {file: "lib/index.js", format: "cjs"},
      {file: "lib/index.mjs", format: "esm"},
    ],
    plugins: [ts({tsconfig: "./tsconfig.json"}), terser()],
  },
  {
    input: "./src/index.ts",
    output: [{file: "lib/index.d.ts", format: "esm"}],
    plugins: [dts({tsconfig: "./tsconfig.json"})],
  },
];
