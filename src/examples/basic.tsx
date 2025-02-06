"use client";

import Select from "../components/select";

const options = [
  { label: "option one to be selected from", value: "option_1" },
  { label: "option 2", value: "option_2" },
  { label: "option 3", value: "option_3" },
  { label: "option 4", value: "option_4" },
  { label: "option 5", value: "option_5" },
];

export const Basic = () => {
  <div className="flex">
    <Select options={options} multiselect />
  </div>;
};
