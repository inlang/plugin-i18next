/**
 * The plugin settings.
 *
 * Define your plugin settings here.
 */
export type PluginSettings = {
  /**
   * Defines the path pattern for the resources.
   *
   * Must include the `{language}` placeholder.
   *
   * @example
   *  "./resources/{language}.json"
   */
  pathPattern: string;
};

/**
 * Validates the plugin settings.
 *
 * Use this function to validate the plugin settings.
 * We recommend to not use zod as zod increases the bundle size
 * by 5x.
 */
export function throwIfInvalidSettings(settings: Partial<PluginSettings>) {
  if (settings.pathPattern === undefined) {
    throw new Error("The pathPattern setting is required");
  }
}
