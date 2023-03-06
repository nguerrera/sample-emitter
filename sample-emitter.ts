import { join } from "path";
import {
  EmitContext,
  createCadlLibrary,
  emitFile,
  navigateProgram,
} from "@cadl-lang/compiler";

export const $lib = createCadlLibrary({
  name: "sample-emitter",
  diagnostics: {},
  // provide an option to redirect the output file
  emitter: {
    options: {
      type: "object",
      additionalProperties: false,
      properties: {
        "output-file": {
          type: "string",
          nullable: true,
        },
      },
    },
  },
});

export interface SampleEmitterOptions {
  // configured output file path
  "output-file": string;
}

export async function $onEmit(
  context: EmitContext<SampleEmitterOptions>
): Promise<void> {
  // Sample emitter that just writes out the names of all models in global namespace to a text file
  let output = "";
  for (const model of context.program.getGlobalNamespaceType().models.values()) {
    output += model.name;
    output += "\n";
  }

  if (context.program.compilerOptions.noEmit) {
    // don't write output if noEmit option is set
    return;
  }
  // use configured output file path or default to sample.txt in the emitter output directory
  const outputPath =
    context.options["output-file"] ??
    join(context.emitterOutputDir, "sample.txt");

  emitFile(context.program, { path: outputPath, content: output });
}
