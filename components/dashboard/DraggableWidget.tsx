'use client';

import { Reorder, useDragControls } from 'framer-motion';
import WidgetWrapper from './WidgetWrapper';

interface DraggableWidgetProps {
    widget: any;
    children: React.ReactNode;
    className?: string;
}

export default function DraggableWidget({ widget, children, className }: DraggableWidgetProps) {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={widget}
            className={className}
            dragListener={false}
            dragControls={controls}
        >
            <WidgetWrapper
                id={widget.id}
                title={widget.title}
                dragControls={controls}
            >
                {children}
            </WidgetWrapper>
        </Reorder.Item>
    );
}
