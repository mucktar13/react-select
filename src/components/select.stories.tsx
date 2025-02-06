import type { Meta, StoryObj } from "@storybook/react";

import Select from "./select";

const meta: Meta<typeof Select> = {
  component: Select,
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Primary: Story = {
  args: {
    options: [
      { label: "option 1", value: "option_1" },
      { label: "option 2", value: "option_2" },
    ],
    value: { label: "option 1", value: "option_1" },
    multiselect: false,
  },
};

export const Multiple: Story = {
  args: {
    options: [
      { label: "option one to be selected from", value: "option_1" },
      { label: "option 2", value: "option_2" },
      { label: "option 3", value: "option_3" },
      { label: "option 4", value: "option_4" },
      { label: "option 5", value: "option_5" },
    ],
    value: [{ label: "option one to be selected from", value: "option_1" }],
    multiselect: true,
  },
};

export const WithSearch: Story = {
  args: {
    options: [
      { label: "option 1", value: "option_1" },
      { label: "option 2", value: "option_2" },
    ],
    value: [{ label: "option 1", value: "option_1" }],
    searchable: true,
    multiselect: true,
  },
};

export const CustomRender: Story = {
  args: {
    options: [
      { label: "option 1", value: "option_1" },
      { label: "option 2", value: "option_2" },
    ],
    value: [{ label: "option 1", value: "option_1" }],
    searchable: false,
    multiselect: true,
    renderItem: (option) => (
      <div className="w-full bg-indigo-300">{option.label}</div>
    ),
  },
};

export const CustomStyle: Story = {
  args: {
    options: [
      { label: "option 1", value: "option_1" },
      { label: "option 2", value: "option_2" },
    ],
    value: [{ label: "option 1", value: "option_1" }],
    searchable: false,
    multiselect: true,
    dropdownStyle: "z-[var(--dropdown-z-index)] bg-cyan-200",
  },
};
