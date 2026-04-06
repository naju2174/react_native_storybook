# Component Creation Guide

## What is the Page Folder?

The `Page` component is a **page-level** component in Storybook's component hierarchy:

```
Atoms → Molecules → Organisms → Pages
Button    Header     Sidebar     Page
```

- **Button** = smallest building block (atom)
- **Header** = combines Buttons together (molecule/organism)
- **Page** = a full screen/layout that composes Header + content (page)

The Page component demonstrates **component-driven development** — you build small components first, then compose them into larger ones. In Storybook, it lets you preview full page layouts with mock data without running the actual app navigation.

```tsx
// Page uses Header, Header uses Button — composition in action
export const Page = () => (
  <ScrollView>
    <Header user={user} onLogin={...} />
    <View><Text>Page content here</Text></View>
  </ScrollView>
);
```

---

## Folder Structure (Per Component)

```
src/components/
  ComponentName/
    ComponentName.types.ts      # Shared TypeScript interfaces
    ComponentName.native.tsx    # iOS + Android implementation
    ComponentName.web.tsx       # Web implementation
    ComponentName.stories.tsx   # Storybook stories
    index.ts                    # Barrel export
```

**How platform resolution works:**

```ts
// index.ts
export { MyComponent } from './MyComponent';
//                           ^^^^^^^^^^^
// Metro bundler auto-resolves:
//   → MyComponent.native.tsx  (on iOS/Android)
//   → MyComponent.web.tsx     (on Web)
```

You never import `.native.tsx` or `.web.tsx` directly — just import from `./MyComponent` and the bundler picks the right file.

---

## Dependencies

### Already Installed (in this project)

| Package | Purpose |
|---------|---------|
| `react-native` | Core RN components (View, Text, Pressable, Animated, etc.) |
| `expo` | Build toolchain, dev server, platform bundling |
| `nativewind` + `tailwindcss` | Tailwind CSS classes in React Native via `className` |
| `react-native-web` | Makes RN components work on web |
| `react-native-reanimated` | High-performance native animations |
| `react-native-gesture-handler` | Native touch/gesture system |
| `lucide-react-native` | SVG icons (works on native, NOT on web) |
| `@storybook/react-native` | Storybook for React Native |
| `@storybook/addon-ondevice-controls` | Interactive prop controls in Storybook |
| `@storybook/addon-ondevice-actions` | Action logging in Storybook |

### Optional (Install When Needed)

```bash
# Advanced animations
npm install react-native-reanimated    # Already installed

# Bottom sheets, modals
npm install @gorhom/bottom-sheet       # Already installed

# Date pickers
npm install @react-native-community/datetimepicker  # Already installed

# SVG support
npm install react-native-svg           # Already installed
```

---

## Styling: Native vs Web

### React Native (iOS & Android) — `ComponentName.native.tsx`

```tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';

// Option 1: StyleSheet (most common, optimized)
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',       // RN uses flexbox by default
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    // NO: css units like 'px', 'rem', 'em'
    // NO: shorthand like 'border: 1px solid red'
    // YES: individual properties
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  text: {
    fontSize: 14,
    fontWeight: '700',          // Must be a string in RN
    color: '#333',
    lineHeight: 24,             // Number, not '24px'
  },
});

// Option 2: NativeWind (Tailwind classes)
<Text className="text-sm font-bold text-gray-800">Hello</Text>

// Option 3: Inline styles
<View style={{ padding: 16 }} />
```

**Key RN style differences from CSS:**
- All dimensions are unitless (density-independent pixels)
- `fontWeight` must be a string: `'400'`, `'700'`, not `400`
- No CSS shorthand (`margin: '10px 20px'` → use `marginVertical`, `marginHorizontal`)
- `flex` defaults to column direction (not row like web)
- No `className` unless using NativeWind
- No hover states — use `Pressable` with `pressed` state

### Web — `ComponentName.web.tsx`

```tsx
// Option 1: Inline styles (used in this project)
<button style={{
  display: 'flex',
  padding: '14px 16px',        // CSS units OK
  border: 'none',              // Shorthand OK
  cursor: 'pointer',           // Web-only properties OK
  fontSize: 16,
  fontWeight: 500,
}}>

// Option 2: CSS shorthand works
<div style={{
  border: '1px solid #D1D5DB',
  margin: '0 auto',
}}>
```

**Summary Table:**

| Feature | Native (.native.tsx) | Web (.web.tsx) |
|---------|---------------------|----------------|
| Base components | `View`, `Text`, `Pressable` | `div`, `span`, `button` |
| Styling | `StyleSheet.create()` or NativeWind | Inline styles or CSS |
| Units | Unitless numbers | `px`, `rem`, `em`, etc. |
| Layout | Flexbox (column default) | Flexbox (row default) |
| Click/tap | `onPress` | `onClick` |
| Hover | Not available | `:hover` or JS |
| Scroll | `ScrollView`, `FlatList` | Native scroll / `overflow: auto` |
| Cursor | Not applicable | `cursor: 'pointer'` |
| Font weight | String: `'700'` | Number or string: `700` |

---

## Animations: Can They Be Reused?

**No — animations need separate implementations per platform.**

### Native Animations (`ComponentName.native.tsx`)

```tsx
import { Animated, Easing } from 'react-native';

// Option 1: Animated API (built-in, used in Accordion)
const [heightAnim] = useState(() => new Animated.Value(0));

useEffect(() => {
  Animated.timing(heightAnim, {
    toValue: expanded ? measuredHeight : 0,
    duration: 300,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: false,       // false for layout props (height, width)
                                  // true for transform/opacity (better perf)
  }).start();
}, [expanded]);

<Animated.View style={{ height: heightAnim, overflow: 'hidden' }}>
  {children}
</Animated.View>

// Option 2: react-native-reanimated (more powerful, already installed)
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const height = useSharedValue(0);
const animStyle = useAnimatedStyle(() => ({
  height: withTiming(height.value, { duration: 300 }),
}));
```

### Web Animations (`ComponentName.web.tsx`)

```tsx
// Option 1: CSS Transitions (simplest, used in Accordion)
<div style={{
  display: 'grid',
  gridTemplateRows: expanded ? '1fr' : '0fr',
  transition: 'grid-template-rows 0.3s ease-in-out',
}}>

// Option 2: CSS transform/opacity
<svg style={{
  transition: 'transform 0.3s',
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
}} />

// Option 3: Web Animations API or CSS @keyframes for complex animations
```

**Why can't they be shared?**

| Aspect | Native | Web |
|--------|--------|-----|
| Animation engine | `Animated` API or `Reanimated` (runs on native thread) | CSS transitions / Web Animations API |
| Layout measurement | `onLayout` callback | Automatic (browser handles it) |
| Height animation | Need to measure with `onLayout`, then animate to measured value | CSS grid `0fr → 1fr` or `max-height` trick |
| Transform syntax | `transform: [{ rotate: '180deg' }]` (array of objects) | `transform: 'rotate(180deg)'` (string) |
| Performance | `useNativeDriver: true` runs on GPU | Browser compositing handles it |

**What CAN be shared:**
- Animation **logic** (durations, easing curves, state) via the types file or a shared hook
- The **props interface** is always shared via `.types.ts`
- The **stories** are shared — one `.stories.tsx` works for both platforms

---

## Storybook Concepts Explained

### Full Annotated Example

```tsx
// Accordion.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-native';
import { Accordion, AccordionGroup } from './';
import { Text, View } from 'react-native';
import type { AccordionProps } from './Accordion.types';

// ─── META (default export) ─────────────────────────────
const meta: Meta<AccordionProps> = {

  // 1. TITLE — Where this appears in Storybook's sidebar
  //    "Components/Accordion" → sidebar folder "Components" → item "Accordion"
  //    Can be nested: "Design System/Inputs/TextInput"
  title: 'Components/Accordion',

  // 2. COMPONENT — The actual component to render
  //    Storybook uses this to auto-detect props for the controls panel
  component: Accordion,

  // 3. TAGS — Metadata flags
  //    'autodocs' → auto-generates a documentation page from your stories
  tags: ['autodocs'],

  // 4. PARAMETERS — Configure Storybook's behavior (not component props)
  parameters: {

    // 'layout' controls how the story is positioned in the preview canvas:
    //   'centered' → centers the component (good for buttons, cards)
    //   'fullscreen' → no padding, fills the canvas (good for pages, navbars)
    //   'padded' → default, adds some padding around the component
    layout: 'centered',

    // 'viewport' sets the default device frame
    viewport: {
      defaultViewport: 'responsive',   // or 'iphone14', 'pixel5', etc.
    },
  },

  // 5. DECORATORS — Wrapper components around every story
  //    Use for: adding padding, providers, themes, fixed-width containers
  decorators: [
    (Story) => (
      <View style={{ minWidth: 600, width: 600 }}>
        <Story />     {/* Your actual component renders here */}
      </View>
    ),
  ],

  // 6. ARGTYPES — Configure the controls panel for each prop
  //    Override auto-detected control types
  argTypes: {
    backgroundColor: { control: 'color' },     // Shows color picker
    size: {
      control: 'select',                        // Dropdown
      options: ['small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },           // Toggle switch
    onClick: { action: 'clicked' },             // Logs to actions panel
    // Hide a prop from controls:
    _internal: { table: { disable: true } },
  },

  // 7. ARGS — Default prop values for ALL stories in this file
  //    Individual stories can override these
  args: {
    title: 'Default Title',
    children: 'Default content',
  },
};

export default meta;

type Story = StoryObj<AccordionProps>;


// ─── STORIES (named exports) ─────────────────────────────

// STORY 1: Simple — just override args
export const Default: Story = {
  args: {
    title: 'What is React Native?',
    children: 'React Native lets you build mobile apps using React.',
  },
};

// STORY 2: Another args variant
export const ShortContent: Story = {
  args: {
    title: 'Quick answer',
    children: 'Yes.',
  },
};

// STORY 3: Custom render — when you need full control over the JSX
export const MultipleItems: Story = {
  render: () => (
    <AccordionGroup
      items={[
        { title: 'Item 1', children: 'Content 1' },
        { title: 'Item 2', children: 'Content 2' },
      ]}
    />
  ),
};

// STORY 4: Passing JSX children via args
export const WithCustomContent: Story = {
  args: {
    title: 'Custom rich content',
    children: (
      <View style={{ gap: 8 }}>
        <Text>Bullet 1</Text>
        <Text>Bullet 2</Text>
      </View>
    ),
  },
};
```

---

### Quick Reference Table

| Concept | What it does | Required? |
|---------|-------------|-----------|
| **`Meta`** | TypeScript type for the meta config object. Generic parameter (`Meta<Props>`) enables type-safe `args`. | Yes (for TS) |
| **`StoryObj`** | TypeScript type for individual story objects. Gives autocomplete on `args`, `render`, `play`, etc. | Yes (for TS) |
| **`title`** | Sets the sidebar path: `'Folder/Component'` | Yes |
| **`component`** | The component to render. Storybook reads its props for auto-generating controls. | Yes |
| **`tags`** | Array of string flags. `'autodocs'` = auto-generate docs page. | No |
| **`parameters`** | Configure Storybook UI behavior: `layout`, `viewport`, `backgrounds`, `docs`. NOT component props. | No |
| **`decorators`** | Wrapper components. Run in order: last decorator wraps first. Use for providers, layout containers. | No |
| **`argTypes`** | Override auto-detected controls. Set control type, options, actions, or hide props. | No |
| **`args`** (in meta) | Default prop values for all stories in the file. | No |
| **`args`** (in story) | Props for this specific story. Merges with and overrides meta args. | No |
| **`render`** | Custom render function. Use when you need to render something different from `<Component {...args} />`. | No |

---

### How `children` Works as Args

Normally `children` is JSX nested inside a component:
```tsx
<Accordion title="Hello">This is children</Accordion>
```

But in Storybook, stories pass props through the `args` object. Since `children` is technically just a prop in React, you can pass it as an arg:

**String children:**
```tsx
export const Default: Story = {
  args: {
    title: 'Question?',
    children: 'This string becomes the children prop',
    //         └── equivalent to: <Accordion>This string...</Accordion>
  },
};
```

**JSX children:**
```tsx
export const RichContent: Story = {
  args: {
    title: 'Custom content',
    children: (
      <View>
        <Text>Line 1</Text>
        <Text>Line 2</Text>
      </View>
    ),
    // └── equivalent to: <Accordion><View>...</View></Accordion>
  },
};
```

**Why this works:** React compiles `<Comp>stuff</Comp>` into `React.createElement(Comp, { children: 'stuff' })`. So `children` is just a regular prop. Storybook renders your component as:

```tsx
<Accordion {...args} />
// Which becomes:
<Accordion title="Question?" children="This string becomes the children prop" />
// Which is identical to:
<Accordion title="Question?">This string becomes the children prop</Accordion>
```

**When to use `render` instead of `args.children`:**
- Use `args.children` when you're rendering the **same component** declared in `meta.component`
- Use `render` when you need a **completely different component** (like `AccordionGroup` instead of `Accordion`) or need to compose multiple components together

```tsx
// args.children — Storybook renders <Accordion {...args} /> automatically
export const Simple: Story = {
  args: { title: 'Hello', children: 'World' },
};

// render — you control what gets rendered
export const Group: Story = {
  render: () => <AccordionGroup items={[...]} />,
};
```

---

## Step-by-Step: Creating a New Component

```bash
# 1. Create the folder
mkdir src/components/Card

# 2. Create these 5 files:
```

**Card.types.ts** — Define the interface first
```tsx
export interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  onPress?: () => void;
}
```

**Card.native.tsx** — React Native implementation
```tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { CardProps } from './Card.types';

export function Card({ title, description, onPress }: CardProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, borderRadius: 8, backgroundColor: '#FFF',
               borderWidth: 1, borderColor: '#E5E7EB' },
  title: { fontSize: 18, fontWeight: '600', color: '#111827' },
  description: { fontSize: 14, color: '#6B7280', marginTop: 4 },
});
```

**Card.web.tsx** — Web implementation
```tsx
import type { CardProps } from './Card.types';

export function Card({ title, description, onPress }: CardProps) {
  return (
    <div onClick={onPress} style={{
      padding: 16, borderRadius: 8, backgroundColor: '#FFF',
      border: '1px solid #E5E7EB', cursor: onPress ? 'pointer' : 'default',
    }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>{title}</h3>
      <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{description}</p>
    </div>
  );
}
```

**index.ts** — Barrel export
```tsx
export { Card } from './Card';
export type { CardProps } from './Card.types';
```

**Card.stories.tsx** — Stories
```tsx
import type { Meta, StoryObj } from '@storybook/react-native';
import { Card } from './';
import type { CardProps } from './Card.types';

const meta: Meta<CardProps> = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<CardProps>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    description: 'This is a description of the card component.',
  },
};
```

```bash
# 3. Regenerate stories & run
npm run storybook
npx expo start --web
```
