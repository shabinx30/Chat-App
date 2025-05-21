import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../redux/store"; 


type ProtectorProps = {
    children: React.ReactNode;
    type: string;
};

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const Protector: React.FC<ProtectorProps> = ({ children, type }) => {

    const state = useTypedSelector((state) => state);

    if(type == 'in' && !state.auth.user?.userId) {
        return <Navigate to={'/login'} />
    }

    if(type == 'out' && !state.auth.user?.userId) {
        return <>{children}</>
    }

    if(type == 'out' && state.auth.user?.userId) {
        return <Navigate to={'/'} />
    }

    return <>{children}</>
};

export default Protector;
