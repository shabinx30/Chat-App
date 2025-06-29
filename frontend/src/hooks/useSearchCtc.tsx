import axios from "axios";
import { useCallback } from "react";
import debounce from "../libs/debouncer";
import type { ctcType } from "../components/contacts/Contacts";

interface SearchCtcHookType {
    setCtc: React.Dispatch<React.SetStateAction<ctcType[]>>;
    userId: string | undefined;
}

const useSearchCtc = ({setCtc, userId}: SearchCtcHookType) => {
    const { VITE_BASE_URL } = import.meta.env;

    const searchContact = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();

        axios
            .get(
                `${VITE_BASE_URL}/api/chat/searchcontacts?value=${value}&userId=${userId}`
            )
            .then((res) => {
                setCtc([]);
                for (let con of res.data.chat) {
                    setCtc((p) => [con, ...p]);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };  
    
    const debouncedSearch = useCallback(debounce(searchContact, 750), []);

    return {debouncedSearch}
};

export default useSearchCtc;
