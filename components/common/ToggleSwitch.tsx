import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => {
  const handleToggle = () => {
    onChange(!checked);
  };

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={handleToggle} />
        <div className={`block w-12 h-6 rounded-full transition ${checked ? 'bg-brand-accent' : 'bg-brand-border'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${checked ? 'translate-x-6' : ''}`}></div>
      </div>
      {label && <span className="ml-3 text-sm font-medium text-gray-300">{label}</span>}
    </label>
  );
};

export default ToggleSwitch;