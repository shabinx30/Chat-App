import { useState, useRef, useEffect } from "react";
import { BiMessageSquareDetail } from "react-icons/bi";

interface PosType {
    visible: boolean;
    x: number;
    y: number;
}

const Welcome = () => {
    const [pos, setPos] = useState<PosType>({ visible: false, x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const context = (e: React.MouseEvent) => {
        e.preventDefault();
        const container = containerRef.current;
        if (!container) return;

        // Get container's bounding box
        const containerRect = container.getBoundingClientRect();

        // Get menu dimensions
        const menuWidth = menuRef.current?.offsetWidth || 80; // Default width if not rendered
        const menuHeight = menuRef.current?.offsetHeight || 80; // Default height if not rendered

        // Mouse position relative to the container
        let x = e.clientX - containerRect.left;
        let y = e.clientY - containerRect.top;

        // Adjust position to keep menu within container boundaries
        if (x + menuWidth > containerRect.width) {
            x = containerRect.width - menuWidth - 2; // 2px buffer
        }
        if (y + menuHeight > containerRect.height) {
            y = containerRect.height - menuHeight - 2; // 2px buffer
        }

        // Ensure menu stays within viewport (optional, if container is smaller than viewport)
        if (x < 0) x = 2;
        if (y < 0) y = 2;

        setPos({ visible: true, x, y });
    };

    const handleClick = () => {
        setPos((prev) => ({ ...prev, visible: false }));
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setPos((prev) => ({ ...prev, visible: false }));
            }
        };
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

    return (
        <div
            ref={containerRef}
            onClick={handleClick}
            onContextMenu={context}
            className="relative hidden md:flex flex-1/3 bg-[#dee1ff] dark:bg-[#131313] text-black dark:text-white flex-col justify-center items-center text-center"
        >
            <BiMessageSquareDetail size={50} className="mb-4 text-[#626fff]" />
            <h1 className="font-semibold text-2xl mb-2">Welcome to Chat!</h1>
            <p className="text-[#484848] dark:text-[#868686] text-[0.9em]">
                Select a contact to start the conversation.
            </p>
            {pos.visible && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    ref={menuRef}
                    className="absolute w-[10em] h-[12em] bg-white dark:bg-[#313131] rounded-2xl shadow-md"
                    style={{
                        top: `${pos.y}px`,
                        left: `${pos.x}px`,
                    }}
                ></div>
            )}
        </div>
    );
};

export default Welcome;
