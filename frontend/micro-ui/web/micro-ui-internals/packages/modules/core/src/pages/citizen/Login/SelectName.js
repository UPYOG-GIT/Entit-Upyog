import React from "react";
import { FormStep } from "@upyog/digit-ui-react-components";

const SelectName = ({ config, onSelect, t }) => {
  return <FormStep config={config} onSelect={onSelect} t={t}></FormStep>;
};

export default SelectName;
