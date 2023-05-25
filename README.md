# plugin-i18next

This plugin reads and writes resources in combination with i18next.

<br>

## Usage

```js
// filename: inlang.config.js

export async function defineConfig(env) {

  const { default: jsonPlugin } = await env.$import(
    "https://cdn.jsdelivr.net/gh/inlang/plugin-i18next@1/dist/index.js"
  );

  return {
    referenceLanguage: "en",
    plugins: [
      jsonPlugin({
        pathPattern: "./resources/{language}/*.json",
      })
    ]
  };
}
```

<br>

## PluginSettings

Our plugin offers further configuration options that can be passed as arguments. These options include `pathPattern` and `variableReferencePattern` (optional), and can be adjusted to suit your needs.

Here is the syntax for the PluginSettings object in TypeScript:
```typescript
type PluginSettings = {
  pathPattern: string;
};
```

### `pathPattern`

To use our plugin, you need to provide a path to the directory where your language-specific files are stored. Use the dynamic path syntax `{language}` to specify the language name. Note that subfile structures are not supported.

**Most common - with namespace support:**
```typescript
pathPattern: "./resources/{language}/*.json"
```
**Only one namespace:**
```typescript
pathPattern: "./resources/{language}/translation.json"
```
**Language as file name:**
```typescript
pathPattern: "./resources/{language}.json"
```

<br>

## Contributing

### Getting started

Run the following commands in your terminal (node and npm must be installed):

1. `npm install`
2. `npm run dev`

`npm run dev` will start the development environment which automatically compiles the [src/index.ts](./src/index.ts) files to JavaScript ([dist/index.js](dist/index.js)), runs tests defined in `*.test.ts` files and watches changes.

### Publishing

Run `npm run build` to generate a build.

The [dist](./dist/) directory is used to distribute the plugin directly via CDN like [jsDelivr](https://www.jsdelivr.com/). Using a CDN works because the inlang config uses dynamic imports to import plugins.

Read the [jsDelivr documentation](https://www.jsdelivr.com/?docs=gh) on importing from GitHub.
