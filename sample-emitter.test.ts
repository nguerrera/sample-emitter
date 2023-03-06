import { createTestHost, createTestLibrary, expectDiagnosticEmpty, resolveVirtualPath } from "@cadl-lang/compiler/testing";
import { strictEqual } from "assert";
import { resolve } from "path";
import { fileURLToPath } from "url";

export const SampleEmitterTestLibrary = createTestLibrary({
  name: "sample-emitter",
  packageRoot: resolve(fileURLToPath(import.meta.url), "../.."),
});

export async function sampleEmitterOutputFor(
  code: string,
) {
  const host = await createTestHost({
    libraries: [SampleEmitterTestLibrary]
  });
  const outputFile = resolveVirtualPath("sample.txt");
  host.addCadlFile("./main.cadl", code);
  const diagnostics = await host.diagnose("./main.cadl", {
    noEmit: false,
    emit: ["sample-emitter"],
    options: { "sample-emitter": { "output-file": outputFile } },
  });
  expectDiagnosticEmpty(diagnostics);
  return host.fs.get(outputFile);
}

describe("sample test", () => {
  it("emits all the model names", async () => {
    const output = await sampleEmitterOutputFor(`
      model A {}
      model B {}
    `);
    strictEqual(output, "A\nB\n");
  });
});