# Select Component

## Overview

The `Select` component is a React component that provides a customizable dropdown select input. It supports single and multi-select modes, searching, and custom rendering of options.

## Features

- **Single and Multi-Select Modes:** Supports both single and multi-select functionality via the `multiselect` prop.
- **Searchable Options:** Includes a search input to filter options dynamically when the `searchable` prop is enabled.
- **Customizable Rendering:** Allows custom rendering of select options using the `renderItem` prop.
- **Debounced Search:** Implements debounced search functionality to optimize performance in searchable mode.
- **Context Provider:** Utilizes React Context API for managing component state and props, ensuring efficient state management and prop drilling avoidance.
- **Accessibility:** Designed with accessibility in mind, providing keyboard navigation and ARIA attributes for screen reader compatibility.

## Props

| Prop Name     | Type                                                         | Description                                                                                                       | Default Value |
| :------------ | :----------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- | :------------ |
| `options`     | `Option[]`                                                   | Array of options to display in the select dropdown. Each option is an object with `value` and `label` properties. | `[]`          |
| `value`       | `SingleValue<Option> \| MultiValue<Option>`                  | The current value(s) of the select component. Supports both single and multi-select values.                       | `null`        |
| `multiselect` | `boolean`                                                    | Enables multi-select mode if set to `true`.                                                                       | `false`       |
| `searchable`  | `boolean`                                                    | Enables search functionality if set to `true`.                                                                    | `false`       |
| `onChange`    | `(value: SingleValue<Option> \| MultiValue<Option>) => void` | Callback function invoked when the selected value(s) change.                                                      | `undefined`   |
| `renderItem`  | `(data: Option) => React.ReactNode`                          | Function to customize the rendering of each option in the dropdown.                                               | `undefined`   |

## Interfaces

### `Option`

```typescript
interface Option {
  value: string;
  label: string;
}
```

- `value`: A unique string value for the option.
- `label`: The display label for the option.

### `SingleValue<Option>`

```typescript
type SingleValue<Option> = Option | null;
```

- Represents a single selected option or `null` for no selection.

### `MultiValue<Option>`

```typescript
type MultiValue<Option> = Option[];
```

- Represents an array of selected options in multi-select mode.

## Component Structure

- `Select`: Main component that renders the select dropdown.
- `SelectProvider`: Context provider that manages the state and context for the `Select` component and its children.
- `SelectTrigger`: Component that acts as the dropdown trigger, displaying the current value and toggling the dropdown on click.
- `SelectValue`: Component responsible for rendering the selected value(s) within the trigger.
- `SelectSearch`: Search input component, displayed when the `searchable` prop is enabled.
- `SelectItems`: Component that renders the list of options in the dropdown.
- `SelectContent`: Container component for the dropdown content, handling dropdown positioning and closing behavior.

## Usage

### Basic Usage

```tsx
import Select from "./Select";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const MyComponent: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<SingleValue<Option>>(null);

  const handleChange = (value: SingleValue<Option>) => {
    setSelectedValue(value);
  };

  return (
    <Select options={options} value={selectedValue} onChange={handleChange} />
  );
};
```

### Multi-Select Usage

```tsx
import Select, { MultiValue } from "./Select";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const MyComponent: React.FC = () => {
  const [selectedValues, setSelectedValues] = useState<MultiValue<Option>>([]);

  const handleChange = (value: MultiValue<Option>) => {
    setSelectedValues(value);
  };

  return (
    <Select
      multiselect
      options={options}
      value={selectedValues}
      onChange={handleChange}
    />
  );
};
```

### Searchable Select

```tsx
<Select
  searchable
  options={options}
  value={selectedValue}
  onChange={handleChange}
/>
```

### Custom Render Item

```tsx
<Select
  options={options}
  value={selectedValue}
  onChange={handleChange}
  renderItem={(option) => <div style={{ color: "blue" }}>{option.label}</div>}
/>
```

## Dependencies

- React
- lucide-react
- tailwind

## Installation

update your package.json dependencies

```json
{
  "dependencies": {
    "react-select": "https://github.com/mucktar13/react-select.git"
  }
}
```

install the package via package manager

```bash
npm install react-select
```

## Import

```tsx
import Select from "react-select";
```

---
