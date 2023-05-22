/**
 * Use this config file to configure and test your inlang plugin.
 *
 * @type {import("@inlang/core/config").DefineConfig}
 */
export async function defineConfig(env) {
  // importing the plugin from local file for testing purposes
  const { default: myPlugin } = await env.$import("./dist/index.js");

  return {
    referenceLanguage: "en",
    languages: ["en", "de"],
    plugins: [
      myPlugin({
        pathPattern: "./example/i18n/locales/{language}/*.json",
      }),
    ],
  };
}
