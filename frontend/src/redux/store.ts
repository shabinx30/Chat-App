import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface User {
    userId: string;
    name: string;
    email: string;
    profile: string;
    updatedAt: string;
}

const INITIAL_STATE: { token: string | null; user: User | null } = {
    token: null,
    user: null,
};

const user = createSlice({
    name: "auth",
    initialState: INITIAL_STATE,
    reducers: {
        login: (state, action) => {
            (state.token = action.payload.token),
                (state.user = action.payload.user);
        },
        logout: (state) => {
            (state.token = null), (state.user = null);
        },
    },
});


const store = configureStore({
    reducer: {
        auth: user.reducer
    },
});

export type RootState = ReturnType<typeof store.getState>;

export const { login, logout } = user.actions;
export default store;
