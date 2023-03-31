# commandline

A simple utility for using the commandline

**[Issues and Pull Requests](https://github.com/FishingHacks/futils/labels/commandline)**

## colors

This object contains a list of colorcodes for ansi 256 terminals

## color

```typescript
type Color =
    | {
          space: 'fg' | 'bg';
          color:
              | 'black'
              | 'blue'
              | 'cyan'
              | 'gray'
              | 'green'
              | 'magenta'
              | 'red'
              | 'white'
              | 'yellow';
      }
    | {
          space: 'fgBright' | 'bgBright';
          color:
              | 'black'
              | 'blue'
              | 'cyan'
              | 'green'
              | 'magenta'
              | 'red'
              | 'white'
              | 'yellow';
      }
    | {
          space: 'reset';
          color:
              | 'all'
              | 'underline'
              | 'bold'
              | 'strikethrough'
              | 'italic'
              | 'bg'
              | 'fg'
              | 'colorAll'
              | 'style';
      }
    | {
          space: 'style';
          color: 'italic' | 'strikethrough' | 'underline' | 'bold';
      };
function color(text: string, color: Color): string;
```

Color a text

## getInput

```typescript
function getInput(question: string): Promise<string>;
```

Gets input from the user over stdin

## removeTerminalColors

```typescript
function removeTerminalColors(text: string): string;
```

Removes terminal (ansi) colorcodes from a string

## removeAnsiColors

```typescript
function removeAnsiColors(text: string): string;
```

Removes ansi colorcodes from a string

## createTextbox

```typescript
function createTextbox(title: string | undefined, contents: string): string;
```

Creates a textbox

## createTable

```typescript
function createTable<T extends string>(
    header: string,
    keys: T[],
    data: { [Key in T]: string | number | boolean | { type: 'delimiter' } }[],
    differentiateLines: boolean | undefined = false
): string
```

Creates a table. Specify all the keys in the keys array. The header is the title. Specify the data into data. The data can be a delimiter by setting the current data value to `{ type: 'delimiter' }`.

## applyPadding

```typescript
export interface PaddingOptions {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}
function applyPadding(str: string, padding?: PaddingOptions);
```

Applies padding (uses spaces (` `) and newlines (`\n`))

## TextboxBuilder

Creates a textbox

### setTitle

```typescript
function setTitle(title: string): TextboxBuilder;
```

sets the title

### setFooter

```typescript
function setFooter(footer: string): TextboxBuilder;
```

sets the footer

### paddingLeft

```typescript
function paddingLeft(padding: number): TextboxBuilder;
```

Sets the padding to the left

### paddingRight

```typescript
function paddingRight(padding: number): TextboxBuilder;
```

Sets the padding to the right

### padding

```typescript
function padding(padding: { left: number; right: number; }): TextboxBuilder;
```

Sets the padding

### getPaddingLeft

```typescript
function getPaddingLeft(): number;
```

Gets the left-padding

### getPaddingRight

```typescript
function getPaddingRight(): number;
```

Gets the right-padding

### getPadding

```typescript
function getPadding(): { left: number; right: number; };
```

Gets the padding

### getFooter

```typescript
function getFooter(): string;
```

Gets the footer

### addLine

```typescript
function addLine(line: string): TextboxBuilder;
```

Adds a line to the textbox

### addLines

```typescript
function addLines(lines: string|string[]): TextboxBuilder;
```

Adds 1 or more lines to the textbox

### setMinLength

```typescript
function setMinLength(length: number): TextboxBuilder;
```

Sets the minimum length of the textbox

### getMinLength

```typescript
function getMinLength(): number;
```

Gets the minimum length

### addDivider

```typescript
function addDivider(): TextboxBuilder
```

Adds a divider between lines

### getLines

```typescript
function getLines(): (string|{ type: 'divider' })[];
```

Gets the lines

### getTitle

```typescript
function getTitle(): string;
```

Gets the title

### removeLine

```typescript
function removeLine(last?: boolean): TextboxBuilder
```

Removes the last or first line. Defaults to firstline

### build

```typescript
function build(): string;
```

Builds the textbox

### log

```typescript
function log(loggingFunction?: (text: string) => void): void;
```

Logs the textbox, defaults to console.log