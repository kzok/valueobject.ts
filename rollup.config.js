import ts from "@wessberg/rollup-plugin-ts";
import {terser} from "rollup-plugin-terser";

export default [
  {
    input: "./src/index.ts",
    output: [
      {file: "lib/index.js", format: "cjs"},
      {file: "lib/index.mjs", format: "esm"},
    ],
    plugins: [ts(), terser({ecma: 5, toplevel: true, ie8: true})],
  },
];
