import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { useSelector, type TypedUseSelectorHook } from "react-redux";

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


export const { login, logout } = user.actions;
export default store;

export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;