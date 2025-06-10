import { motion, AnimatePresence } from "framer-motion";
import { IoCloseCircle } from "react-icons/io5";

interface previewType {
    preview: string;
    setPreview: React.Dispatch<React.SetStateAction<string>>;
}

const InputPreview = ({ preview, setPreview }: previewType) => {
    return (
        <AnimatePresence>
            {preview && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 0.5,
                        },
                    }}
                    exit={{
                        opacity: 0,
                        y: 50,
                        transition: {
                            duration: 0.25,
                        },
                    }}
                    className="absolute bottom-[4em] left-0 shadow-[0_1px_10px] shadow-black/50 dark:shadow-black bg-white dark:bg-[#2b2b2b] p-1 rounded-[12px]"
                >
                    <div className="relative">
                        <IoCloseCircle
                            size={22}
                            onClick={() => setPreview('')}
                            className="absolute right-2 top-2 text-white mix-blend-difference"
                        />
                        <img
                            src={preview}
                            className="max-h-[50vh] rounded-[12px]"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InputPreview;
