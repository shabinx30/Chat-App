interface PosType {
    visible: boolean;
    x: number;
    y: number;
}

interface menuType {
    e: React.MouseEvent;
    containerRef: React.RefObject<HTMLDivElement | null>;
    setPos: (value: React.SetStateAction<PosType>) => void;
    menuRef: React.RefObject<HTMLUListElement | null>;
}

export const menuContext = ({ e, containerRef, setPos, menuRef }: menuType) => {
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
