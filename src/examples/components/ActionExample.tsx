import React from 'react';
import { useSignal, useSignalValue } from '../../hooks/useSignal';
import { S } from '../../components/S';
import { Action } from '../../components/Action.tsx';

const ActionExample = () => {
  // 1. Load the theme from localStorage on init, or default to 'light'.
  const initialTheme = localStorage.getItem('theme-preference') || 'light';
  const theme = useSignal(initialTheme);
  const status = useSignal('Ready');

  // 2. Define the side-effect: save the theme to storage and update status.
  const saveThemeToStorage = (newTheme: string) => {
    localStorage.setItem('theme-preference', newTheme);
    status.set(`Theme '${newTheme}' saved.`);
    setTimeout(() => status.set('Ready'), 2000); // Reset status message
  };

  return (
    <div className="flex flex-col">
      <p className="text-sm text-gray-600 mb-2">
        Select a theme. The change will be saved to localStorage automatically.
      </p>

      <fieldset className="flex space-x-4 mb-4">
        <legend className="sr-only">Theme</legend>
        <label className="flex items-center">
          <input
            type="radio"
            name="theme"
            value="light"
            checked={useSignalValue(theme) === 'light'}
            onChange={() => theme.set('light')}
            className="form-radio h-4 w-4 text-blue-600"
          />
          <span className="ml-2">Light</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={useSignalValue(theme) === 'dark'}
            onChange={() => theme.set('dark')}
            className="form-radio h-4 w-4 text-blue-600"
          />
          <span className="ml-2">Dark</span>
        </label>
      </fieldset>

      <div className="bg-gray-100 p-3 rounded">
        <div className="text-sm text-gray-600">Current Theme:</div>
        <div className="font-bold text-lg uppercase">
          <S>{theme}</S>
        </div>
        <div className="text-xs text-green-600 h-4 mt-1">
          <S>{status}</S>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Try changing the theme, then reload the page. Your preference will be
        remembered.
      </p>

      {/* 3. The Action component declaratively binds the side-effect to the signal. */}
      <Action watch={theme} onTrigger={saveThemeToStorage} />
    </div>
  );
};

export default ActionExample;