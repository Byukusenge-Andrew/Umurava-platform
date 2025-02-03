import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state
export type AuthState = {
  role: "admin" | "talent" | null;
};

const initialState: AuthState = {
  role: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<AuthState["role"]>) => {
      state.role = action.payload;
    },
  },
});

export const { setRole } = authSlice.actions;
export default authSlice.reducer;