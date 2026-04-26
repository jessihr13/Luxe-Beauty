'use client';

import { useSortable } from '@dnd-kit/sortable';
import WidgetWrapper from './WidgetWrapper';

interface SortableWidgetProps {
    widget: any;
    children: React.ReactNode;
    className?: string;
}

export default function SortableWidget({ widget, children, className }: SortableWidgetProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: widget.id });

    return (
        <div className={className}>
            <WidgetWrapper
                id={widget.id}
                title={widget.title}
                attributes={attributes}
                listeners={listeners}
                setNodeRef={setNodeRef}
                transform={transform}
                transition={transition}
                isDragging={isDragging}
            >
                {children}
            </WidgetWrapper>
        </div>
    );
}
