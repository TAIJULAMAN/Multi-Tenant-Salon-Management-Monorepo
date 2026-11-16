import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isFirstTime: boolean;
  isAuthenticated: boolean;
  isSubscribed: boolean;
  user: any | null;
}

const initialState: AuthState = {
  isFirstTime: true,
  isAuthenticated: false,
  isSubscribed: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<Partial<AuthState>>) => {
      return { ...state, ...action.payload };
    },
    signIn: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.isSubscribed = false;
      state.user = null;
    },
  },
});

export const { setAuthState, signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
