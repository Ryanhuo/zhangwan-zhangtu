#!/usr/bin/env node
// Build the distributable `zhangtu` system package into ./dist:
// - bundle + minify the CLI and all local modules into a single self-contained
//   dist/cli.mjs (the CLI has zero external npm deps, only node: builtins)
// - copy the shell.html runtime template next to it
// - copy the canonical project skills (incl. zhangwanUI design system) into
//   dist/skills so `zhangtu sync-skills` can seed/update a user project
//
// The published package ships only ./dist — users install and run it, but the
// readable multi-file source stays in this repo and is never part of a project.
import { build } from "esbuild";
import { cpSync, existsSync, copyFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "dist");
const repoSkills = join(here, "..", "..", ".agents", "skills", "project");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

await build({
  entryPoints: [join(here, "cli.mjs")],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  minify: true,
  legalComments: "none",
  outfile: join(dist, "cli.mjs"),
  banner: { js: "#!/usr/bin/env node" },
});

copyFileSync(join(here, "shell.html"), join(dist, "shell.html"));

if (existsSync(repoSkills)) {
  cpSync(repoSkills, join(dist, "skills"), { recursive: true });
  console.log("bundled skills payload from", repoSkills);
} else {
  console.warn("warning: canonical skills dir not found at", repoSkills, "- dist/skills will be empty");
}

console.log("built", join(dist, "cli.mjs"));
