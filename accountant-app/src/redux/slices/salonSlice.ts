import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SalonItem {
  id: string;
  name: string;
  location?: string;
}

interface SalonState {
  selectedSalon: string;
  availableSalons: string[];
}

const initialState: SalonState = {
  selectedSalon: 'All Salons',
  availableSalons: [
    'All Salons',
    'Glamour Beauty Roma',
    'Style Studio Milano',
    'Chic Hair & Beauty',
  ],
};

const salonSlice = createSlice({
  name: 'salon',
  initialState,
  reducers: {
    setSelectedSalon: (state, action: PayloadAction<string>) => {
      state.selectedSalon = action.payload;
    },
    setAvailableSalons: (state, action: PayloadAction<string[]>) => {
      state.availableSalons = action.payload;
    },
  },
});

export const { setSelectedSalon, setAvailableSalons } = salonSlice.actions;
export default salonSlice.reducer;
