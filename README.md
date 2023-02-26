# CopyCat

CopyCat is a simple text editor with powerful macro features.

- **Scratchpad**: A place to write, powered by macro `/commands`.
- **Macros**: Save text macros, and assign them to `/commands` to quickly insert them in Scratchpad.
- **Variables**: Use `{variables}` to make macros more dynamic. Press <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> to quickly move forward / backward through unresolved variables in the Scratchpad. CopyCat will warn you before copying text when variables are left unresolved so that messages aren't sent with placeholder text. (i.e. Hello, `{name}`!)
- **Snippets**: Create new macros from existing macro snippets by highlighting text, and pressing <kbd>Ctrl</kbd> + <kbd>M</kbd> or clicking the "Create snippet from selection" button.
- **Search**: Search for macros using the built-in search. Supports properties: `name`, `text`, `command` for more specific searching. (i.e. "name:greeting")
