import {
    configureStore,
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit";
import { useSelector, type TypedUseSelectorHook } from "react-redux";

interface User {
    userId: string;
    name: string;
    email: string;
    profile: string;
    updatedAt: string;
}

let userData: User | null = null;
const jwtString = localStorage.getItem("jwt");

if (jwtString) {
    try {
        const parsed = JSON.parse(jwtString);
        if (parsed && typeof parsed === "object" && "userId" in parsed) {
            userData = parsed as User;
        }
    } catch (error) {
        console.error("Failed to parse jwt from localStorage", error);
    }
}

const INITIAL_STATE: { token: string | null; user: User | null } = {
    token: null,
    user: userData,
};

const user = createSlice({
    name: "auth",
    initialState: INITIAL_STATE,
    reducers: {
        login: (
            state,
            action: PayloadAction<{ token: string | null; user: User }>
        ) => {
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
        auth: user.reducer,
    },
});

export const { login, logout } = user.actions;
export default store;

export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
