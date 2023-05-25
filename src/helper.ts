export interface StringWithParents {
  value: string;
  parents: string[] | undefined;
  id: string;
  keyName: string;
}

export type ExtendedMessagesType = {
  [key: string]: {
    value: string;
    parents?: StringWithParents["parents"];
    fileName?: string;
    keyName?: string;
  };
};

/**
 * Recursive function to add nested keys to an object.
 *
 * @example addNestedKeys(message, ["common", "title"], "en", "test")
 */
export const addNestedKeys = (
  obj: any,
  parentKeys: string[] | undefined,
  keyName: string,
  value: string
) => {
  if (!parentKeys || parentKeys.length === 0) {
    obj[keyName] = value;
  } else if (parentKeys.length === 1) {
    obj[parentKeys[0]] = { [keyName]: value };
  } else {
    if (!obj[parentKeys[0]]) {
      obj[parentKeys[0]] = {};
    }
    addNestedKeys(obj[parentKeys[0]], parentKeys.slice(1), keyName, value);
  }
};

/**
 * Detects the spacing of a JSON string.
 *
 * @example detectJsonSpacing(stringifiedFile)
 */
export const detectJsonSpacing = (jsonString: string) => {
  const patterns = [
    {
      spacing: 1,
      regex: /^{\n {1}[^ ]+.*$/m,
    },
    {
      spacing: 2,
      regex: /^{\n {2}[^ ]+.*$/m,
    },
    {
      spacing: 3,
      regex: /^{\n {3}[^ ]+.*$/m,
    },
    {
      spacing: 4,
      regex: /^{\n {4}[^ ]+.*$/m,
    },
    {
      spacing: 6,
      regex: /^{\n {6}[^ ]+.*$/m,
    },
    {
      spacing: 8,
      regex: /^{\n {8}[^ ]+.*$/m,
    },
    {
      spacing: "\t",
      regex: /^{\n\t[^ ]+.*$/m,
    },
  ];

  for (const { spacing, regex } of patterns) {
    if (regex.test(jsonString)) {
      return spacing;
    }
  }

  // No matching spacing configuration found
  return 2;
};

/**
 * Recursive function to collect all strings in an object.
 * It creates and array, that contains the string, the parents and the id.
 *
 * @example collectStringsWithParents(parsedResource)
 */
export const collectStringsWithParents = (
  obj: any,
  parents: string[] | undefined = [],
  fileName?: string
) => {
  const results: StringWithParents[] = [];

  if (typeof obj === "string") {
    results.push({
      value: obj,
      parents: parents.length > 1 ? parents.slice(0, -1) : undefined,
      id: fileName ? fileName + "." + parents.join(".") : parents.join("."),
      keyName: parents[parents.length - 1],
    });
  } else if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const currentParents = [...parents, key];
        const childResults = collectStringsWithParents(
          obj[key],
          currentParents,
          fileName
        );
        results.push(...childResults);
      }
    }
  }

  return results;
};
