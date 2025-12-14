# React App Guide

A lightweight, customizable React component library for creating interactive product tours and onboarding experiences.

## Live Demo

See the components in action: https://v0-react-component-nine-rho.vercel.app/

## Features

- 🎯 **Two Component Types**: `StepTour` for multi-step tours, `HighlightTour` for single element highlights
- 🎨 **Fully Customizable**: CSS variables + custom class names support
- 🌍 **i18n Ready**: All labels are customizable
- 🎭 **Dark Mode**: Built-in dark mode support
- 📦 **Zero Dependencies**: Only React and ReactDOM required
- 🔧 **Framework Agnostic**: Works with Tailwind, Bootstrap, CSS Modules, styled-components, etc.

## Installation

```bash
npm install react-app-guide
# or
yarn add react-app-guide
# or
pnpm add react-app-guide
```

## Quick Start

### Basic Usage

```tsx
import { StepTour } from 'react-app-guide';
import 'react-app-guide/styles.css';

function App() {
  const [open, setOpen] = useState(false);

  const steps = [
    {
      id: 'step-1',
      selector: '#welcome-button',
      title: 'Welcome',
      description: 'Click here to get started',
    },
    {
      id: 'step-2',
      selector: '#settings',
      title: 'Settings',
      description: 'Customize your preferences here',
    },
  ];

  return (
    <>
      <button onClick={() => setOpen(true)}>Start Tour</button>
      <StepTour
        open={open}
        steps={steps}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
```

### With Intro/Outro Screens

```tsx
<StepTour
  open={open}
  steps={steps}
  onClose={() => setOpen(false)}
  intro={{
    title: 'Welcome to Our App',
    description: 'Let us show you around!',
    nextLabel: 'Start Tour',
    closeLabel: 'Skip',
  }}
  outro={{
    title: 'Tour Complete!',
    description: 'You\'re all set to get started.',
    nextLabel: 'Finish',
    closeLabel: 'Back',
  }}
/>
```

### Single Element Highlight

```tsx
import { HighlightTour } from 'react-app-guide';

<HighlightTour
  open={true}
  targetSelector="#important-feature"
  title="New Feature"
  description="Check out this amazing new feature!"
  onClose={() => setOpen(false)}
/>
```

## API Reference

### StepTour Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | ✅ | - | Controls tour visibility |
| `steps` | `TourStep[]` | ✅ | - | Array of tour steps |
| `onClose` | `() => void` | ❌ | - | Called when tour closes |
| `intro` | `TourIntro` | ❌ | - | Optional intro screen config |
| `outro` | `TourOutro` | ❌ | - | Optional outro screen config |
| `renderActions` | `function` | ❌ | - | Custom action buttons renderer |
| `classNames` | `StepTourClassNames` | ❌ | - | Custom CSS classes |

### TourStep Type

```tsx
type TourStep = {
  id: string;
  selector: string;        // CSS selector for target element
  title: string;
  description: string;
  nextLabel?: string;      // Custom "Next" button label
  backLabel?: string;      // Custom "Back" button label
  closeLabel?: string;     // Custom "Close" button label
  onEnter?: () => void;    // Called when step becomes active
  onNext?: () => void;     // Called when user clicks "Next"
};
```

### HighlightTour Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | ✅ | - | Controls visibility |
| `targetSelector` | `string` | ✅ | - | CSS selector for target element |
| `title` | `string` | ✅ | - | Tooltip title |
| `description` | `string` | ✅ | - | Tooltip description |
| `nextLabel` | `string` | ❌ | `"Next"` | "Next" button label |
| `backLabel` | `string` | ❌ | `"Back"` | "Back" button label |
| `closeLabel` | `string` | ❌ | `"Close"` | "Close" button label |
| `onNext` | `() => void` | ❌ | - | Called when "Next" is clicked |
| `onPrev` | `() => void` | ❌ | - | Called when "Back" is clicked |
| `onClose` | `() => void` | ✅ | - | Called when closed |
| `progress` | `{ current: number; total: number }` | ❌ | - | Progress indicator |
| `classNames` | `HighlightClassNames` | ❌ | - | Custom CSS classes |

## Styling & Customization

### Dark Mode Support

This library uses `.dark` class for dark mode detection (compatible with Tailwind CSS and Next.js):

**Tailwind CSS / Next.js (automatic):**
```html
<html class="dark">
```

**Other theme systems (e.g., data-theme):**
```css
[data-theme="dark"] {
  --step-tour-bg: #0f172a;
  --step-tour-text: #e2e8f0;
  --step-tour-muted: #94a3b8;
  --step-tour-border: rgba(148, 163, 184, 0.3);
  --step-tour-backdrop: rgba(0, 0, 0, 0.5);
  --step-tour-spot: rgba(59, 130, 246, 0.18);
  --step-tour-progress: #cbd5e1;
}
```

### CSS Variables

Customize the default theme by overriding CSS variables:

```css
:root {
  --step-tour-primary: #3b82f6;
  --step-tour-primary-hover: #2563eb;
  --step-tour-bg: #ffffff;
  --step-tour-text: #0f172a;
  --step-tour-muted: #64748b;
  --step-tour-border: rgba(148, 163, 184, 0.7);
  --step-tour-backdrop: rgba(0, 0, 0, 0.3);
  --step-tour-radius-lg: 16px;
  --step-tour-radius-xl: 18px;
  --step-tour-shadow-lg: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

### Custom Class Names

Override default styles with custom classes:

```tsx
<StepTour
  classNames={{
    overlay: "my-custom-overlay",
    backdrop: "my-custom-backdrop",
    modal: "my-custom-modal",
    title: "my-custom-title",
    description: "my-custom-description",
    actions: "my-custom-actions",
    button: "my-custom-button",
    buttonOutline: "my-custom-button-outline",
    buttonPrimary: "my-custom-button-primary",
  }}
/>
```

**Note:** The `modal` className is reused for both intro screens and step tooltips. To customize them independently, use `HighlightTour` directly:

```tsx
{showIntro ? (
  <MyCustomIntro onNext={() => setShowIntro(false)} />
) : (
  <HighlightTour
    classNames={{ tooltip: "my-custom-tooltip" }}
    // ... other props
  />
)}
```

### Custom Action Buttons

```tsx
<StepTour
  steps={steps}
  renderActions={({ onClose, onNext, closeLabel, nextLabel, kind }) => (
    <div className="flex gap-2">
      <button onClick={onClose} className="btn-secondary">
        {closeLabel}
      </button>
      {onNext && (
        <button onClick={onNext} className="btn-primary">
          {nextLabel}
        </button>
      )}
    </div>
  )}
/>
```

## Internationalization (i18n)

All text labels are customizable:

```tsx
// Japanese example
<StepTour
  steps={steps}
  intro={{
    title: "ようこそ",
    description: "アプリの使い方をご案内します",
    nextLabel: "開始する",
    closeLabel: "スキップ",
  }}
/>

// Per-step labels
const steps = [
  {
    id: 'step-1',
    selector: '#button',
    title: 'ボタン',
    description: 'ここをクリックしてください',
    nextLabel: '次へ',
    closeLabel: '閉じる',
  },
];
```

## Advanced Usage

### Lifecycle Callbacks

```tsx
const steps = [
  {
    id: 'step-1',
    selector: '#feature',
    title: 'Feature',
    description: 'Amazing feature',
    onEnter: () => {
      console.log('User entered step 1');
      // Track analytics, scroll to element, etc.
    },
    onNext: () => {
      console.log('User clicked next');
      // Track user progression
    },
  },
];
```

### Dynamic Steps

```tsx
const [steps, setSteps] = useState(initialSteps);

useEffect(() => {
  // Update steps based on user state
  if (userIsAdvanced) {
    setSteps(advancedSteps);
  }
}, [userIsAdvanced]);
```

### Conditional Tours

```tsx
function App() {
  const hasSeenTour = localStorage.getItem('tour-completed');
  const [showTour, setShowTour] = useState(!hasSeenTour);

  const handleClose = () => {
    setShowTour(false);
    localStorage.setItem('tour-completed', 'true');
  };

  return <StepTour open={showTour} steps={steps} onClose={handleClose} />;
}
```

## TypeScript Support

Fully typed with TypeScript:

```tsx
import type { TourStep, TourIntro, StepTourProps } from 'react-app-guide';

const steps: TourStep[] = [
  {
    id: 'step-1',
    selector: '#element',
    title: 'Title',
    description: 'Description',
  },
];
```

## Keyboard Shortcuts

When a tour is active, the following keyboard shortcuts are available:

- **Escape**: Close the tour
- **Arrow Right (→)**: Go to next step
- **Arrow Left (←)**: Go to previous step

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

Requires modern browser with `ResizeObserver` and `MutationObserver` support.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/utilitis/react-app-guide/issues).
