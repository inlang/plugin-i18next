import { it, expect, describe } from "vitest";
import { parse } from "./messageReferenceMatchers.js";

describe("tFunction", () => {
  it('should detect t("{id}")', () => {
    // double quotes
    const sourceCode = `
    const x = t("some-id")
    `;
    const matches = parse(sourceCode);
    expect(matches[0].messageId === "some-id");
  });

  it(`should detect t('{id}')`, () => {
    // single quotes
    const sourceCode = `
    const x = t('some-id')
    `;
    const matches = parse(sourceCode);
    expect(matches[0].messageId === "some-id");
  });

  it(`should detect {t('{id}')}`, () => {
    // using the t function in markup
    const sourceCode = `
    <p>{t('some-id')}</p>
    `;
    const matches = parse(sourceCode);
    expect(matches[0].messageId === "some-id");
  });

  it(`should detect $t('{id}')`, () => {
    // using a t function with a prefix such as $ in svelte
    const sourceCode = `
    <p>{$t('some-id')}</p>
    `;
    const matches = parse(sourceCode);
    expect(matches[0].messageId === "some-id");
  });

  it("should detect t({id}, ...args)", () => {
    // passing arguments to the t function should not prevent detection
    const sourceCode = `
    <p>{$t('some-id' , { name: "inlang" }, variable, arg3)}</p>
    `;
    const matches = parse(sourceCode);
    expect(matches[0].messageId === "some-id");
  });

  it("should not mismatch a string with different quotation marks", () => {
    const sourceCode = `
    <p>{$t("yes')}</p>
    `;
    const matches = parse(sourceCode);
    console.log(matches);
    expect(matches).toHaveLength(0);
  });

  // it('should match with no pre-fixed whitespace', () => {
  //     const sourceCode = `t('some-id')`;
  //     const matches = parser.parse(sourceCode) as Match[];
  //     expect(matches[0].id === 'some-id');
  // });

  it("should ignore whitespace", () => {
    // prefixing with space see test above
    const sourceCode = ` t('some-id' ) `;
    const matches = parse(sourceCode);
    expect(matches[0].messageId === "some-id");
    expect(
      sourceCode.slice(
        matches[0].position.start.character,
        matches[0].position.end.character
      )
    ).toBe("some-id");
  });

  it("should detect combined message.attribute ids", () => {
    const sourceCode = ` t('some-message.with-attribute')`;
    const matches = parse(sourceCode);
    expect(matches[0].messageId === "some-message.with-attribute");
  });
});
