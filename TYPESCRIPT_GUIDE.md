# TypeScript Learning Guide for React Native + Storybook

> TypeScript is the **same language** on iOS, Android, and Web. The syntax, types, and classes don't change per platform. What changes is the **libraries and APIs** you use (React Native vs HTML DOM). This guide covers all the TS patterns used in this project with detailed explanations.

---

## Table of Contents

1. [Basic Types](#1-basic-types)
2. [Interfaces](#2-interfaces)
3. [Type Aliases](#3-type-aliases)
4. [Interface vs Type — When to Use Which](#4-interface-vs-type--when-to-use-which)
5. [Generics](#5-generics)
6. [Union Types](#6-union-types)
7. [Literal Types](#7-literal-types)
8. [Optional Properties & Parameters](#8-optional-properties--parameters)
9. [Type Assertions](#9-type-assertions)
10. [typeof & keyof](#10-typeof--keyof)
11. [Utility Types](#11-utility-types)
12. [Function Types](#12-function-types)
13. [React Component Types](#13-react-component-types)
14. [React Hook Types](#14-react-hook-types)
15. [Event Types — Platform Specific](#15-event-types--platform-specific)
16. [Style Types — Platform Specific](#16-style-types--platform-specific)
17. [import type](#17-import-type)
18. [Enums](#18-enums)
19. [Intersection Types](#19-intersection-types)
20. [Discriminated Unions](#20-discriminated-unions)
21. [Type Guards](#21-type-guards)
22. [Record Type](#22-record-type)
23. [Tuple Types](#23-tuple-types)
24. [Template Literal Types](#24-template-literal-types)
25. [Module Declarations](#25-module-declarations)
26. [Storybook-Specific Types](#26-storybook-specific-types)

---

## 1. Basic Types

The fundamental building blocks. Same on all platforms.

```ts
// Primitive types
const name: string = 'Accordion';
const count: number = 42;
const isOpen: boolean = true;
const nothing: null = null;
const notDefined: undefined = undefined;

// Arrays
const items: string[] = ['one', 'two', 'three'];
const numbers: Array<number> = [1, 2, 3];       // Same thing, different syntax

// Object
const user: { name: string; age: number } = { name: 'Jane', age: 30 };

// any — disables type checking (avoid when possible)
let anything: any = 'hello';
anything = 42;        // No error — TS stops checking
anything = true;      // No error

// unknown — safe version of any (must check type before using)
let mystery: unknown = 'hello';
// mystery.toUpperCase();  // ❌ Error: can't use until you check the type
if (typeof mystery === 'string') {
  mystery.toUpperCase();   // ✅ OK — TS knows it's a string now
}

// void — function that returns nothing
function logMessage(msg: string): void {
  console.log(msg);
  // no return statement
}

// never — function that never returns (throws or infinite loop)
function throwError(msg: string): never {
  throw new Error(msg);
}
```

**When you'll use these:** Every single file. Props, state, variables — everything starts with these basic types.

---

## 2. Interfaces

Interfaces define the **shape of an object**. This is the #1 most-used TypeScript feature in React — every component's props are defined as an interface.

```ts
// Basic interface
interface ButtonProps {
  label: string;
  primary?: boolean;         // ? = optional
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

// Using it in a component
function Button({ label, primary = false, size = 'medium', onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Extending Interfaces

Interfaces can **inherit** from other interfaces. This avoids repeating shared properties.

```ts
// Base interface
interface BaseProps {
  id?: string;
  testID?: string;
  accessible?: boolean;
}

// Extended — has everything from BaseProps + its own properties
interface ButtonProps extends BaseProps {
  label: string;
  primary?: boolean;
  onClick?: () => void;
}

// ButtonProps now has: id, testID, accessible, label, primary, onClick

// Multiple extension
interface IconButtonProps extends ButtonProps {
  icon: string;
  iconPosition?: 'left' | 'right';
}

// IconButtonProps has ALL properties from BaseProps + ButtonProps + its own
```

### Real example from this project

```ts
// Accordion.types.ts
interface AccordionProps {
  title: string;
  children: string | React.ReactElement;
  expanded?: boolean;
  onToggle?: () => void;
  _borderTop?: boolean;
  _borderBottom?: boolean;
}

interface AccordionGroupItem {
  title: string;
  children: string | React.ReactElement;
}

interface AccordionGroupProps {
  items: AccordionGroupItem[];    // Array of AccordionGroupItem objects
}
```

---

## 3. Type Aliases

`type` creates a name for any type — not just objects. More flexible than interfaces.

```ts
// Simple alias
type Size = 'small' | 'medium' | 'large';

// Object shape (similar to interface)
type User = {
  name: string;
  email?: string;
};

// Function type
type ClickHandler = () => void;
type ChangeHandler = (value: string) => void;

// Complex type
type Children = string | React.ReactElement;

// Conditional / computed types (interfaces can't do this)
type Response<T> = T | null;
type StringOrNumber = string | number;
```

### Real example from this project

```ts
// Header.types.ts
export type User = {
  name: string;
};

export interface HeaderProps {
  user?: User;           // User type used inside an interface
  onLogin?: () => void;
  onLogout?: () => void;
  onCreateAccount?: () => void;
}
```

---

## 4. Interface vs Type — When to Use Which

| Feature | `interface` | `type` |
|---------|------------|--------|
| Object shapes | ✅ Yes | ✅ Yes |
| Extend/inherit | ✅ `extends` | ✅ `&` (intersection) |
| Union types | ❌ No | ✅ `string \| number` |
| Primitives | ❌ No | ✅ `type ID = string` |
| Computed types | ❌ No | ✅ Conditional, mapped, etc. |
| Declaration merging | ✅ Yes (auto-combines) | ❌ No |
| Best for | Component props, API shapes | Unions, aliases, computed types |

**Rule of thumb for this project:**
- **Props** → `interface` (e.g., `interface ButtonProps {}`)
- **Simple types, unions** → `type` (e.g., `type Size = 'small' | 'medium' | 'large'`)
- **Both work for objects** — pick one and be consistent

```ts
// Interface — preferred for component props
interface ButtonProps {
  label: string;
  size?: Size;
}

// Type — preferred for unions, aliases, computed types
type Size = 'small' | 'medium' | 'large';
type Children = string | React.ReactElement;
```

---

## 5. Generics

Generics let you write **reusable code** that works with multiple types. Think of `<T>` as a type variable — a placeholder that gets filled in when you use it.

```ts
// Without generics — only works for strings
function firstItem(arr: string[]): string {
  return arr[0];
}

// With generics — works for ANY type
function firstItem<T>(arr: T[]): T {
  return arr[0];
}

firstItem<string>(['a', 'b', 'c']);  // Returns string
firstItem<number>([1, 2, 3]);        // Returns number
firstItem([true, false]);             // TS infers T = boolean automatically
```

### Generics with Interfaces

```ts
// A generic response wrapper
interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}

// Usage — T gets replaced with the actual type
const userResponse: ApiResponse<User> = {
  data: { name: 'Jane' },
  status: 200,
};

const listResponse: ApiResponse<string[]> = {
  data: ['item1', 'item2'],
  status: 200,
};
```

### Generics with Constraints

```ts
// T must have a 'length' property
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}

logLength('hello');       // ✅ string has .length
logLength([1, 2, 3]);    // ✅ array has .length
// logLength(42);         // ❌ number doesn't have .length
```

### Where you see generics in this project

```ts
// useState — generic tells TS what the state holds
const [user, setUser] = useState<User>();           // User | undefined
const [count, setCount] = useState<number>(0);      // number
const [openIndex, setOpenIndex] = useState<number | null>(null);

// Storybook Meta — generic connects props to type-safe args
const meta: Meta<ButtonProps> = { ... };

// StoryObj — generic gives type-safe args
type Story = StoryObj<ButtonProps>;
```

---

## 6. Union Types

A value that can be **one of several types**. Uses the `|` (pipe) operator.

```ts
// Basic union
type StringOrNumber = string | number;

let id: StringOrNumber = 'abc';  // ✅
id = 123;                         // ✅
// id = true;                     // ❌ boolean not in the union

// Union with null (nullable)
type MaybeString = string | null;
const name: MaybeString = null;   // ✅

// React children pattern (used in Accordion)
type Children = string | React.ReactElement;
//              ^^^^^^   ^^^^^^^^^^^^^^^^^^
//              plain text   OR   JSX element

// Usage
function Accordion({ children }: { children: Children }) {
  // Must check which type it is before using type-specific methods
  if (typeof children === 'string') {
    return <Text>{children}</Text>;           // TS knows: string
  }
  return <View>{children}</View>;             // TS knows: ReactElement
}
```

---

## 7. Literal Types

Exact values as types. Much more precise than just `string` or `number`.

```ts
// String literals — only these exact values are allowed
type Size = 'small' | 'medium' | 'large';

const s1: Size = 'small';    // ✅
// const s2: Size = 'tiny';  // ❌ 'tiny' is not in the union

// Number literals
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

// Boolean literal
type AlwaysTrue = true;

// Combined with interfaces (used in Button)
interface ButtonProps {
  size?: 'small' | 'medium' | 'large';  // Only these 3 strings
  primary?: boolean;
  label: string;                          // Any string
}
```

### Why this matters in Storybook

When you define `size?: 'small' | 'medium' | 'large'`, Storybook automatically generates a **dropdown control** with those 3 options instead of a free-text input. Literal types drive the Storybook UI.

---

## 8. Optional Properties & Parameters

The `?` operator marks something as optional — it can be `undefined`.

```ts
// Optional property in interface
interface ButtonProps {
  label: string;          // Required — must always be provided
  primary?: boolean;      // Optional — can be omitted
  onClick?: () => void;   // Optional
}

// These are all valid:
<Button label="Click" />
<Button label="Click" primary />
<Button label="Click" primary onClick={() => {}} />

// Optional function parameter
function greet(name: string, greeting?: string): string {
  return `${greeting || 'Hello'}, ${name}!`;
}
greet('Jane');              // "Hello, Jane!"
greet('Jane', 'Welcome');  // "Welcome, Jane!"

// Default values (alternative to optional)
function Button({ primary = false, size = 'medium' }: ButtonProps) {
  // primary is always boolean here — default kicks in if undefined
}

// Optional chaining — safe access on possibly-undefined values
interface User {
  name: string;
  address?: {
    city?: string;
  };
}

const city = user?.address?.city;     // string | undefined (no crash if address is undefined)
onToggle?.();                          // Only calls if onToggle exists (used in Accordion)
```

---

## 9. Type Assertions

Tell TypeScript "I know better than you what type this is." Use sparingly.

```ts
// as keyword
const input = document.getElementById('email') as HTMLInputElement;
input.value = 'test@example.com';  // TS now knows it's an HTMLInputElement

// Without assertion:
// const input = document.getElementById('email');  // Type: HTMLElement | null
// input.value = ...;  // ❌ Error: 'value' doesn't exist on HTMLElement

// as object (used in this project's Accordion.native.tsx)
...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {})
//                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Casting to 'object' because RN's style types don't include 'cursor'

// as const — makes values readonly and literal
const sizes = ['small', 'medium', 'large'] as const;
// Type: readonly ['small', 'medium', 'large']  (not string[])

// Non-null assertion — ! tells TS "this is not null/undefined"
const element = document.getElementById('root')!;
// Use when you're 100% sure it exists. Prefer optional chaining (?.) when possible.
```

---

## 10. typeof & keyof

### typeof — Get the type of a value

```ts
const user = { name: 'Jane', age: 30 };

type UserType = typeof user;
// Result: { name: string; age: number }

// Used in Storybook to infer component props
const meta: Meta<typeof Page> = { ... };
//                ^^^^^^^^^^^
// "Give me the props type of the Page component"
// Instead of manually writing Meta<PageProps>

type Story = StoryObj<typeof meta>;
// Infers the story type from the meta object
```

### keyof — Get the keys of a type as a union

```ts
interface ButtonProps {
  label: string;
  primary: boolean;
  size: string;
}

type ButtonKeys = keyof ButtonProps;
// Result: 'label' | 'primary' | 'size'

// Useful for dynamic property access
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const props: ButtonProps = { label: 'Click', primary: true, size: 'medium' };
const label = getProperty(props, 'label');    // Type: string
const size = getProperty(props, 'size');      // Type: string
// getProperty(props, 'color');               // ❌ Error: 'color' not in ButtonProps
```

---

## 11. Utility Types

Built-in TypeScript helpers that transform types. These are used **constantly**.

### Partial<T> — Make all properties optional

```ts
interface ButtonProps {
  label: string;
  primary: boolean;
  size: 'small' | 'medium' | 'large';
}

type PartialButton = Partial<ButtonProps>;
// Result:
// {
//   label?: string;
//   primary?: boolean;
//   size?: 'small' | 'medium' | 'large';
// }

// Useful for update functions where you only change some fields
function updateButton(current: ButtonProps, updates: Partial<ButtonProps>): ButtonProps {
  return { ...current, ...updates };
}
updateButton(myButton, { size: 'large' });  // Only update size
```

### Required<T> — Make all properties required

```ts
type RequiredButton = Required<ButtonProps>;
// All ? are removed — every property is now mandatory
```

### Pick<T, K> — Select specific properties

```ts
type ButtonLabel = Pick<ButtonProps, 'label'>;
// Result: { label: string }

type ButtonAppearance = Pick<ButtonProps, 'primary' | 'size'>;
// Result: { primary: boolean; size: 'small' | 'medium' | 'large' }
```

### Omit<T, K> — Remove specific properties

```ts
type ButtonWithoutSize = Omit<ButtonProps, 'size'>;
// Result: { label: string; primary: boolean }

// Real-world: extending a component but removing certain props
interface CardProps extends Omit<ButtonProps, 'primary' | 'size'> {
  title: string;
  description: string;
}
// CardProps has: label, title, description (onClick if it existed) — but NOT primary or size
```

### Record<K, V> — Object with specific key and value types

```ts
// Keys are strings, values are CSSProperties
const styles: Record<string, React.CSSProperties> = {
  base: { display: 'inline-block', cursor: 'pointer' },
  primary: { backgroundColor: '#555ab9', color: 'white' },
  small: { padding: '10px 16px', fontSize: 12 },
};
// Used in Button.web.tsx for the styles object

// Keys are specific strings
type SizeMap = Record<'small' | 'medium' | 'large', { padding: number; fontSize: number }>;
const sizes: SizeMap = {
  small: { padding: 10, fontSize: 12 },
  medium: { padding: 11, fontSize: 14 },
  large: { padding: 12, fontSize: 16 },
};
```

### Readonly<T> — Make all properties immutable

```ts
type ReadonlyButton = Readonly<ButtonProps>;
// All properties become readonly — can't reassign after creation

const btn: ReadonlyButton = { label: 'Click', primary: true, size: 'medium' };
// btn.label = 'New';  // ❌ Error: Cannot assign to 'label' because it is a read-only property
```

### ReturnType<T> — Get the return type of a function

```ts
function createUser() {
  return { name: 'Jane', age: 30 };
}

type User = ReturnType<typeof createUser>;
// Result: { name: string; age: number }
```

### NonNullable<T> — Remove null and undefined

```ts
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// Result: string
```

### Extract<T, U> & Exclude<T, U>

```ts
type AllSizes = 'small' | 'medium' | 'large' | 'xlarge';

type SmallSizes = Extract<AllSizes, 'small' | 'medium'>;
// Result: 'small' | 'medium'

type BigSizes = Exclude<AllSizes, 'small'>;
// Result: 'medium' | 'large' | 'xlarge'
```

---

## 12. Function Types

How to type functions — parameters and return values.

```ts
// Basic function type
type ClickHandler = () => void;                    // No params, returns nothing
type ChangeHandler = (value: string) => void;      // One param, returns nothing
type Validator = (input: string) => boolean;        // Returns a boolean

// In interface (component callbacks)
interface FormProps {
  onSubmit: (data: FormData) => void;
  onChange: (field: string, value: string) => void;
  validate?: (value: string) => boolean;     // Optional function
}

// Function declaration with types
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function with types
const multiply = (a: number, b: number): number => a * b;

// Function with optional and default params
function greet(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}!`;
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

// Async function
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

### Callback patterns used in this project

```ts
// Button
interface ButtonProps {
  onClick?: () => void;              // Simple callback, no arguments
}

// Header
interface HeaderProps {
  onLogin?: () => void;
  onLogout?: () => void;
  onCreateAccount?: () => void;
}

// Accordion
interface AccordionProps {
  onToggle?: () => void;             // Toggle state callback
}

// Calling optional callbacks safely
onToggle?.();                         // Only calls if defined
onClick?.();
```

---

## 13. React Component Types

### React.FC (Function Component)

```ts
// With React.FC — explicitly typed as a function component
const Page: React.FC = () => {
  return <View><Text>Hello</Text></View>;
};

// With React.FC and props
const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <Pressable onPress={onClick}><Text>{label}</Text></Pressable>;
};

// Without React.FC — simpler, preferred in modern React
function Button({ label, onClick }: ButtonProps) {
  return <Pressable onPress={onClick}><Text>{label}</Text></Pressable>;
}

// Both work. The project uses a mix of both styles.
```

**React.FC vs plain function:**

| Feature | `React.FC<Props>` | Plain function |
|---------|-------------------|----------------|
| Syntax | `const Comp: React.FC<Props> = (props) => ...` | `function Comp(props: Props) ...` |
| Children | Included automatically (React 17), removed (React 18+) | Must declare in Props |
| Return type | Enforced as ReactElement | Inferred |
| Recommendation | Fine to use | Slightly preferred in modern React |

### React.ReactElement & React.ReactNode

```ts
// ReactElement — a JSX element (what components return)
const element: React.ReactElement = <Text>Hello</Text>;

// ReactNode — anything React can render (broader)
type ReactNode = ReactElement | string | number | boolean | null | undefined | ReactNode[];

// Used in Accordion for children
interface AccordionProps {
  children: string | React.ReactElement;
  // Can be plain text OR a JSX element
  // More restrictive than ReactNode — no arrays, no numbers
}

// If you want to accept anything renderable:
interface CardProps {
  children: React.ReactNode;   // Accepts: string, JSX, arrays, null, etc.
}
```

---

## 14. React Hook Types

### useState

```ts
// TypeScript infers the type from the initial value
const [count, setCount] = useState(0);          // Type: number
const [name, setName] = useState('');            // Type: string
const [isOpen, setIsOpen] = useState(false);     // Type: boolean

// Explicit generic when initial value doesn't tell the full story
const [user, setUser] = useState<User>();                    // Type: User | undefined
const [openIndex, setOpenIndex] = useState<number | null>(null);  // Type: number | null
const [items, setItems] = useState<string[]>([]);            // Type: string[]

// With Animated (from this project's Accordion)
const [heightAnim] = useState(() => new Animated.Value(0));  // Type: Animated.Value
// () => ... is a lazy initializer — runs once on mount
```

### useEffect

```ts
// useEffect doesn't have generics — just type the dependencies
useEffect(() => {
  // Effect runs when expanded or measuredHeight changes
  Animated.timing(heightAnim, {
    toValue: expanded ? measuredHeight : 0,
    duration: 300,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: false,
  }).start();
}, [expanded, measuredHeight, heightAnim]);
//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Dependency array — TS checks these are valid variables

// Cleanup function
useEffect(() => {
  const timer = setTimeout(() => {}, 1000);
  return () => clearTimeout(timer);  // Return type: void | (() => void)
}, []);
```

### useRef

```ts
// DOM element ref (web)
const inputRef = useRef<HTMLInputElement>(null);
// inputRef.current is HTMLInputElement | null

// React Native ref
const scrollViewRef = useRef<ScrollView>(null);

// Mutable value ref (not a DOM element)
const timerRef = useRef<NodeJS.Timeout>();
// timerRef.current is NodeJS.Timeout | undefined
```

### useCallback & useMemo

```ts
// useCallback — memoize a function
const handleClick = useCallback((id: string) => {
  console.log(id);
}, []);  // Type: (id: string) => void

// useMemo — memoize a computed value
const sortedItems = useMemo<Item[]>(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);  // Type: Item[]
```

---

## 15. Event Types — Platform Specific

This is where iOS/Android and Web **differ**. The event objects come from different libraries.

### Web Only (HTML DOM events)

```ts
// Mouse events
onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void

// Keyboard events
onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
// e.key === 'Enter', e.key === 'Escape', etc.

// Form events
onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
// e.target.value gives the input value

onSubmit: (e: React.FormEvent<HTMLFormElement>) => void

// Focus events
onFocus: (e: React.FocusEvent<HTMLInputElement>) => void
onBlur: (e: React.FocusEvent<HTMLInputElement>) => void

// Drag events (web only — no native equivalent)
onDragStart: (e: React.DragEvent<HTMLDivElement>) => void
onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
onDrop: (e: React.DragEvent<HTMLDivElement>) => void

// Full example
function WebInput() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);     // The typed text
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Submit
    }
  };

  return <input onChange={handleChange} onKeyDown={handleKeyDown} />;
}
```

### Native Only (React Native events)

```ts
import { GestureResponderEvent, NativeSyntheticEvent, LayoutChangeEvent } from 'react-native';

// Press events (equivalent of click)
onPress: (e: GestureResponderEvent) => void
onLongPress: (e: GestureResponderEvent) => void
onPressIn: (e: GestureResponderEvent) => void
onPressOut: (e: GestureResponderEvent) => void

// Text input events
onChangeText: (text: string) => void           // Just the string (simpler than web!)
onSubmitEditing: (e: NativeSyntheticEvent<{ text: string }>) => void

// Layout event (used in Accordion to measure height)
onLayout: (e: LayoutChangeEvent) => void
// e.nativeEvent.layout gives { x, y, width, height }

// Scroll events
onScroll: (e: NativeSyntheticEvent<{ contentOffset: { x: number; y: number } }>) => void

// Full example from this project (Accordion.native.tsx)
<View
  onLayout={(e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) setMeasuredHeight(h);
  }}
>

// Pressable style callback (unique to RN)
<Pressable
  style={({ pressed }: { pressed: boolean }) => ({
    opacity: pressed ? 0.7 : 1,
  })}
>
```

### Comparison Table

| Action | Web Type | Native Type |
|--------|----------|-------------|
| Tap/Click | `React.MouseEvent<HTMLElement>` | `GestureResponderEvent` |
| Text change | `React.ChangeEvent<HTMLInputElement>` → `e.target.value` | `(text: string) => void` (just the string!) |
| Key press | `React.KeyboardEvent<HTMLElement>` | Not available (use `onSubmitEditing`) |
| Layout measure | Not needed (browser does it) | `LayoutChangeEvent` → `e.nativeEvent.layout` |
| Scroll | `React.UIEvent<HTMLDivElement>` | `NativeSyntheticEvent<ScrollEvent>` |
| Drag | `React.DragEvent<HTMLElement>` | Use `react-native-gesture-handler` |
| Hover | `onMouseEnter/Leave` | Not available natively |

---

## 16. Style Types — Platform Specific

### Web Styles

```ts
// React.CSSProperties — type for inline styles on web
const buttonStyle: React.CSSProperties = {
  display: 'flex',
  padding: '14px 16px',         // String with units
  border: '1px solid #D1D5DB',  // Shorthand OK
  cursor: 'pointer',            // Web-only property
  fontSize: 16,                 // Number = pixels
  transition: 'transform 0.3s', // CSS transitions
};

// Used in Button.web.tsx
const styles: Record<string, React.CSSProperties> = {
  base: { display: 'inline-block', cursor: 'pointer' },
  primary: { backgroundColor: '#555ab9', color: 'white' },
};
```

### Native Styles

```ts
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

// Individual style types
const containerStyle: ViewStyle = {
  flexDirection: 'row',          // 'column' is default (unlike web!)
  padding: 16,                   // Number only, no units
  backgroundColor: '#FFFFFF',
  borderWidth: 1,                // No shorthand like 'border: 1px solid red'
  borderColor: '#D1D5DB',
};

const textStyle: TextStyle = {
  fontSize: 14,
  fontWeight: '700',             // Must be string in RN
  color: '#333',
  lineHeight: 24,                // Number only
};

const imageStyle: ImageStyle = {
  width: 100,
  height: 100,
  borderRadius: 50,
  resizeMode: 'cover',           // Native-only property
};

// StyleSheet.create — validates and optimizes styles (used in Button.native.tsx)
const styles = StyleSheet.create({
  base: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  label: {
    fontWeight: '700',
    lineHeight: 16,
  } as TextStyle,
});

// Combining styles with array syntax
<View style={[styles.base, styles.primary, { padding: 10 }]} />
//           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Array of styles — later entries override earlier ones
```

### Comparison Table

| Feature | Web (`React.CSSProperties`) | Native (`ViewStyle/TextStyle`) |
|---------|----------------------------|-------------------------------|
| Units | `'16px'`, `'2rem'`, `'50%'` | `16` (unitless, dp) |
| Shorthand | `border: '1px solid red'` | `borderWidth: 1, borderColor: 'red'` |
| Font weight | `fontWeight: 700` (number OK) | `fontWeight: '700'` (must be string) |
| Cursor | `cursor: 'pointer'` | Not available |
| Transition | `transition: 'all 0.3s'` | Use `Animated` API |
| Hover | Supported via CSS | Not available |
| `display` | `'flex'`, `'block'`, `'grid'`, `'none'` | `'flex'`, `'none'` only |
| Default direction | Row | Column |
| Combining | Spread: `{...a, ...b}` | Array: `[a, b]` |

---

## 17. import type

TypeScript-only imports that get **removed at build time**. They don't add any code to your bundle.

```ts
// Regular import — includes the actual code
import { Button } from './Button';

// Type-only import — removed during compilation, zero runtime cost
import type { ButtonProps } from './Button.types';
import type { Meta, StoryObj } from '@storybook/react-native';
import type { AccordionProps, AccordionGroupProps } from './Accordion.types';

// Why use 'import type'?
// 1. Signals intent — "I only need this for type checking"
// 2. Prevents accidental side effects from importing modules
// 3. Smaller bundle — compiler knows it can fully remove these
// 4. Avoids circular dependency issues

// You can also mix in a single import statement
import { Button, type ButtonProps } from './Button';
//       ^^^^^^   ^^^^^^^^^^^^^^^
//       value     type only
```

**Rule:** If you're only importing interfaces, types, or type aliases → use `import type`.

---

## 18. Enums

Named constants. Use sparingly — string unions are usually better in React.

```ts
// Numeric enum (default)
enum Direction {
  Up,        // 0
  Down,      // 1
  Left,      // 2
  Right,     // 3
}

const d: Direction = Direction.Up;  // 0

// String enum (more common in React apps)
enum Size {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

function getButtonClass(size: Size): string {
  switch (size) {
    case Size.Small:  return 'btn-sm';
    case Size.Medium: return 'btn-md';
    case Size.Large:  return 'btn-lg';
  }
}

// const enum — inlined at compile time, no runtime object
const enum Color {
  Red = '#FF0000',
  Blue = '#0000FF',
}
// Color.Red compiles to '#FF0000' directly — no enum object at runtime
```

**Why string unions are preferred in this project:**

```ts
// ❌ Enum — generates runtime JavaScript code
enum Size { Small = 'small', Medium = 'medium', Large = 'large' }

// ✅ String union — zero runtime cost, same type safety
type Size = 'small' | 'medium' | 'large';

// In Storybook, string unions auto-generate dropdown controls.
// Enums don't — you'd need manual argTypes configuration.
```

---

## 19. Intersection Types

Combine multiple types into one using `&`. The result has **all** properties from both.

```ts
// Two separate types
type HasName = { name: string };
type HasAge = { age: number };

// Intersection — must have BOTH name AND age
type Person = HasName & HasAge;
// Result: { name: string; age: number }

// Real-world: extending component props
type BaseProps = {
  accessible?: boolean;
  testID?: string;
};

type ButtonProps = BaseProps & {
  label: string;
  primary?: boolean;
  onClick?: () => void;
};
// ButtonProps has: accessible, testID, label, primary, onClick

// Interface extends does the same thing (preferred for props)
interface ButtonProps extends BaseProps {
  label: string;
  primary?: boolean;
}
```

**Intersection vs Union:**
```ts
type A = { x: number };
type B = { y: number };

type Union = A | B;          // Has x OR y (one or the other)
type Intersection = A & B;   // Has x AND y (both required)
```

---

## 20. Discriminated Unions

A pattern where each type in a union has a **common property** with a unique literal value. TS uses this to narrow the type.

```ts
// Each variant has a 'type' property with a unique string
type Notification =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string; code: number }
  | { type: 'loading' };

function handleNotification(n: Notification) {
  switch (n.type) {
    case 'success':
      console.log(n.message);       // TS knows: message exists
      break;
    case 'error':
      console.log(n.message, n.code); // TS knows: message AND code exist
      break;
    case 'loading':
      console.log('Loading...');     // TS knows: no message or code
      break;
  }
}

// Real-world: API response states
type ApiState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function UserProfile({ state }: { state: ApiState<User> }) {
  switch (state.status) {
    case 'idle':     return <Text>Ready</Text>;
    case 'loading':  return <Text>Loading...</Text>;
    case 'success':  return <Text>{state.data.name}</Text>;  // TS knows .data exists
    case 'error':    return <Text>{state.error}</Text>;       // TS knows .error exists
  }
}
```

---

## 21. Type Guards

Functions or checks that **narrow** a type inside a code block.

```ts
// typeof guard (built-in)
function render(children: string | React.ReactElement) {
  if (typeof children === 'string') {
    return <Text>{children}</Text>;
    //     TS knows: children is string here
  }
  return <View>{children}</View>;
  //     TS knows: children is React.ReactElement here
}
// Used in Accordion: typeof children === 'string'

// instanceof guard
function handleError(err: unknown) {
  if (err instanceof Error) {
    console.log(err.message);   // TS knows: Error type
  }
}

// 'in' guard — check if property exists
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim();              // TS knows: Fish
  } else {
    animal.fly();               // TS knows: Bird
  }
}

// Custom type guard function — uses 'is' keyword
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'name' in value;
}

if (isUser(data)) {
  console.log(data.name);      // TS knows: User type
}

// Truthiness narrowing
const user: User | undefined = getUser();
if (user) {
  console.log(user.name);      // TS knows: not undefined
}

// Nullish check
const value: string | null = getValue();
if (value !== null) {
  console.log(value.toUpperCase());  // TS knows: string
}
```

---

## 22. Record Type

Creates an object type with specific keys and value types. Already covered in Utility Types but deserves its own section since it's heavily used.

```ts
// Record<KeyType, ValueType>

// String keys, any value shape
const styles: Record<string, React.CSSProperties> = {
  base: { display: 'flex' },
  primary: { backgroundColor: 'blue' },
};

// Specific string keys (more strict)
const sizeMap: Record<'small' | 'medium' | 'large', number> = {
  small: 12,
  medium: 14,
  large: 16,
};
// Must have ALL three keys — can't miss one

// Used in Button.native.tsx
const sizes: Record<string, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  small: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 12 },
  medium: { paddingVertical: 11, paddingHorizontal: 20, fontSize: 14 },
  large: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16 },
};

// Dynamic lookup
const sizeStyle = sizes[size];  // Type safe — TS knows the shape
```

---

## 23. Tuple Types

Fixed-length arrays where each position has a specific type. You use these with `useState` every time.

```ts
// Basic tuple
type Coordinate = [number, number];
const point: Coordinate = [10, 20];
// point[0] is number, point[1] is number

// Named tuple (better readability)
type Range = [start: number, end: number];
const range: Range = [0, 100];

// useState returns a tuple
const [count, setCount] = useState(0);
//     ^^^^^  ^^^^^^^^
//     [0]    [1]
// Type: [number, React.Dispatch<React.SetStateAction<number>>]

// Destructuring extracts each position into named variables
const [first, second, third] = ['a', 'b', 'c'] as const;
// first: 'a', second: 'b', third: 'c'

// Optional elements
type FlexiblePoint = [number, number, number?];
const p1: FlexiblePoint = [1, 2];      // ✅
const p2: FlexiblePoint = [1, 2, 3];   // ✅

// Rest elements
type StringList = [string, ...number[]];
const list: StringList = ['header', 1, 2, 3, 4];
```

---

## 24. Template Literal Types

Build string types from other string types. Advanced but powerful.

```ts
// Basic template literal type
type Greeting = `Hello, ${string}`;
const g1: Greeting = 'Hello, World';   // ✅
// const g2: Greeting = 'Hi, World';   // ❌ Must start with "Hello, "

// Combining unions
type Size = 'sm' | 'md' | 'lg';
type Dimension = 'width' | 'height';
type SizeProperty = `${Size}-${Dimension}`;
// Result: 'sm-width' | 'sm-height' | 'md-width' | 'md-height' | 'lg-width' | 'lg-height'

// Real-world: CSS class generation
type Color = 'red' | 'blue' | 'green';
type Shade = 100 | 200 | 300 | 400 | 500;
type TailwindColor = `text-${Color}-${Shade}`;
// 'text-red-100' | 'text-red-200' | ... | 'text-green-500'

// Event handler names
type EventName = 'click' | 'scroll' | 'resize';
type HandlerName = `on${Capitalize<EventName>}`;
// 'onClick' | 'onScroll' | 'onResize'
```

---

## 25. Module Declarations

Tell TypeScript about modules it doesn't know about. Used for non-TS files and global types.

```ts
// nativewind-env.d.ts — already in this project
// Tells TS that nativewind provides a 'className' prop on RN components

// Declaring a module with no types
declare module '*.png' {
  const value: number;     // RN resolves images to numbers (asset IDs)
  export default value;
}

declare module '*.svg' {
  import React from 'react';
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

// Augmenting existing modules (adding to React Native's types)
declare module 'react-native' {
  interface ViewProps {
    className?: string;      // NativeWind adds className to View
  }
  interface TextProps {
    className?: string;      // NativeWind adds className to Text
  }
}

// Global type declarations
declare global {
  var view: View;                    // Used in storybook.requires.ts
  var STORIES: typeof normalizedStories;
}
```

---

## 26. Storybook-Specific Types

The types you use in every `.stories.tsx` file.

### Meta<T>

```ts
import type { Meta } from '@storybook/react-native';

// Meta configures the story group. Generic <T> is the component's props type.
const meta: Meta<ButtonProps> = {
  title: 'Components/Button',     // Sidebar path
  component: Button,              // The component
  parameters: { layout: 'centered' },
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: {                          // Default props for all stories
    onClick: () => {},
  },
};

// Alternative: infer props from the component itself
const meta: Meta<typeof Button> = { ... };
// typeof Button extracts the props type automatically
```

### StoryObj<T>

```ts
import type { StoryObj } from '@storybook/react-native';

// StoryObj defines a single story. Generic matches Meta's generic.
type Story = StoryObj<ButtonProps>;

// Story with args (most common)
export const Primary: Story = {
  args: {
    primary: true,        // Type-checked against ButtonProps
    label: 'Button',
  },
};

// Story with custom render
export const Custom: Story = {
  render: (args) => (
    // args is typed as ButtonProps
    <View>
      <Button {...args} />
      <Button {...args} primary={!args.primary} />
    </View>
  ),
};

// Story with no args (uses meta defaults)
export const Default: Story = {};

// Alternative: derive from meta
type Story = StoryObj<typeof meta>;
// Automatically picks up the props type from meta
```

### Decorator Types

```ts
// Decorators are typed automatically, but here's the shape
type Decorator = (
  Story: React.FC,              // The story component
  context: StoryContext          // Has args, parameters, etc.
) => React.ReactElement;

// In practice, you just write it inline:
const meta: Meta<AccordionProps> = {
  decorators: [
    (Story) => (
      <View style={{ minWidth: 600, width: 600 }}>
        <Story />
      </View>
    ),
  ],
};
```

### ArgTypes

```ts
// Control how Storybook UI renders prop controls
argTypes: {
  // Color picker
  backgroundColor: { control: 'color' },

  // Dropdown select
  size: {
    control: 'select',
    options: ['small', 'medium', 'large'],
  },

  // Radio buttons
  variant: {
    control: 'radio',
    options: ['primary', 'secondary', 'ghost'],
  },

  // Range slider
  opacity: {
    control: { type: 'range', min: 0, max: 1, step: 0.1 },
  },

  // Boolean toggle (auto-detected for boolean props)
  primary: { control: 'boolean' },

  // Text input (auto-detected for string props)
  label: { control: 'text' },

  // Number input
  count: { control: 'number' },

  // Hide from controls panel
  _internal: { table: { disable: true } },

  // Action logging
  onClick: { action: 'clicked' },
}
```

---

## Quick Reference Cheat Sheet

```ts
// ─── TYPES ──────────────────────────
type Size = 'small' | 'medium' | 'large';           // Union of literals
type Nullable<T> = T | null;                          // Generic alias
type Handler = () => void;                            // Function type
type Children = string | React.ReactElement;          // Component children

// ─── INTERFACES ─────────────────────
interface Props { label: string; onClick?: () => void; }
interface Extended extends Props { icon: string; }     // Inheritance

// ─── GENERICS ───────────────────────
useState<number>(0)                                    // State type
Meta<ButtonProps>                                      // Storybook meta
StoryObj<ButtonProps>                                  // Storybook story
Array<string>                                          // Typed array

// ─── UTILITY TYPES ──────────────────
Partial<Props>                     // All optional
Required<Props>                    // All required
Pick<Props, 'label'>               // Only 'label'
Omit<Props, 'onClick'>             // Everything except 'onClick'
Record<string, CSSProperties>      // Key-value object
Readonly<Props>                    // Immutable
ReturnType<typeof fn>              // Function return type
NonNullable<string | null>         // Remove null/undefined

// ─── OPERATORS ──────────────────────
user?.name                         // Optional chaining
onToggle?.()                       // Optional call
name ?? 'default'                  // Nullish coalescing
const el = ref as HTMLElement      // Type assertion
typeof value === 'string'          // Type guard
'name' in obj                      // Property check
```
