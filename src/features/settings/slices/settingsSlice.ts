import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  dialerMode: 'preview' | 'progressive' | 'predictive';
  autoDialDelay: number; // in seconds
  soundEffects: boolean;
  scriptLanguage: 'en' | 'hi';
}

const initialState: SettingsState = {
  dialerMode: 'preview',
  autoDialDelay: 5,
  soundEffects: true,
  scriptLanguage: 'hi',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDialerMode: (state, action: PayloadAction<SettingsState['dialerMode']>) => {
      state.dialerMode = action.payload;
    },
    setAutoDialDelay: (state, action: PayloadAction<number>) => {
      state.autoDialDelay = action.payload;
    },
    toggleSoundEffects: (state) => {
      state.soundEffects = !state.soundEffects;
    },
    setScriptLanguage: (state, action: PayloadAction<SettingsState['scriptLanguage']>) => {
      state.scriptLanguage = action.payload;
    },
    resetSettings: () => initialState
  }
});

export const { setDialerMode, setAutoDialDelay, toggleSoundEffects, setScriptLanguage, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
