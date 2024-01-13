import { Image } from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/react";

export const MyImage = Image.extend({
  defaultOptions: {
    ...Image.options,
    sizes: ["inline", "block", "left", "right"],
    inline:true,
  },
  renderHTML({ HTMLAttributes }) {
    const { style } = HTMLAttributes;
    return [
      "figure",
      { style },
      ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
    ];
  }
});
