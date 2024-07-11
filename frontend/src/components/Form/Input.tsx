// src/components/Form/Input.tsx
// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';

type InputProps = {
  type: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({ type, name, label, value, onChange }: InputProps) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} />
  </div>
);

export default Input;
