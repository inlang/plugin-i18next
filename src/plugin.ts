import type { InlangConfig } from "@inlang/core/config";
import type { InlangEnvironment } from "@inlang/core/environment";
import type * as ast from "@inlang/core/ast";
import { createPlugin } from "@inlang/core/plugin";
import { type PluginSettings, throwIfInvalidSettings } from "./settings.js";

export const plugin = createPlugin<PluginSettings>(({ env, settings }) => {
  return {
    id: "inlang.pluginTemplate",
    config() {
      // throw if the settings are invalid "fail fast" -> better DX
      throwIfInvalidSettings(settings);
      return {
        readResources: (args) => readResources({ ...args, env, settings }),
        writeResources: (args) => writeResources({ ...args, env, settings }),
      };
    },
  };
});

/**
 * Reading resources.
 *
 * The function merges the args from Config['readResources'] with the pluginConfig
 * and EnvironmentFunctions.
 */
async function readResources(
  args: Parameters<InlangConfig["readResources"]>[0] & {
    settings: PluginSettings;
    env: InlangEnvironment;
  }
): ReturnType<InlangConfig["readResources"]> {
  const result: ast.Resource[] = [];
  for (const language of args.config.languages) {
    const resourcePath = args.settings.pathPattern.replace(
      "{language}",
      language
    );
    // reading the json
    const json = JSON.parse(
      await args.env.$fs.readFile(resourcePath, { encoding: "utf-8" })
    );
    result.push(parseResource(json, language));
  }
  return result;
}

/**
 * Writing resources.
 *
 * The function merges the args from Config['readResources'] with the pluginConfig
 * and EnvironmentFunctions.
 */
async function writeResources(
  args: Parameters<InlangConfig["writeResources"]>[0] & {
    settings: PluginSettings;
    env: InlangEnvironment;
  }
): ReturnType<InlangConfig["writeResources"]> {
  for (const resource of args.resources) {
    const resourcePath = args.settings.pathPattern.replace(
      "{language}",
      resource.languageTag.name
    );
    await args.env.$fs.writeFile(resourcePath, serializeResource(resource));
  }
}

/**
 * Parses a resource.
 *
 * @example
 *  parseResource({ "test": "Hello world" }, "en")
 */
function parseResource(
  /** flat JSON refers to the flatten function from https://www.npmjs.com/package/flat */
  flatJson: Record<string, string>,
  language: string
): ast.Resource {
  return {
    type: "Resource",
    languageTag: {
      type: "LanguageTag",
      name: language,
    },
    body: Object.entries(flatJson).map(([id, value]) =>
      parseMessage(id, value)
    ),
  };
}

/**
 * Parses a message.
 *
 * @example
 *  parseMessage("test", "Hello world")
 */
function parseMessage(id: string, value: string): ast.Message {
  return {
    type: "Message",
    id: {
      type: "Identifier",
      name: id,
    },
    pattern: { type: "Pattern", elements: [{ type: "Text", value: value }] },
  };
}

/**
 * Serializes a resource.
 *
 * The function unflattens, and therefore reverses the flattening
 * in parseResource, of a given object. The result is a stringified JSON
 * that is beautified by adding (null, 2) to the arguments.
 *
 * @example
 *  serializeResource(resource)
 */
function serializeResource(resource: ast.Resource): string {
  const json = Object.fromEntries(resource.body.map(serializeMessage));
  // stringyify the object with beautification.
  return JSON.stringify(json, null, 2);
}

/**
 * Serializes a message.
 *
 */
function serializeMessage(message: ast.Message): [id: string, value: string] {
  // note, this example plugin only supports text nodes in a pattern.
  // your plugin should support all types of pattern elements.
  return [message.id.name, (message.pattern.elements[0] as ast.Text).value];
}
