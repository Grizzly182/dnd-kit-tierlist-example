import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import styled from "styled-components";
import Item from "./item"
import { DndContext, useDroppable } from "@dnd-kit/core";

const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    width: '100%',
    minWidth: '100px',
};

const RowHeader = styled.div`
    display: flex;
    width: 100px;
    min-height: 100px;
    min-width: 100px;
    align-items: center;
    justify-content: center;
    margin: 1px;
    color: #333;
    padding: 4px;
    font-size: 1rem;
`;

const itemsContainerStyles = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    minHeight: '100px',
    margin: '1px',
};

const Row = (props) => {
    const { setNodeRef } = useDroppable({
        id: props.id,
        disabled: props.disabled
    });

    return (
        <div style={containerStyle}>
            <RowHeader style={{ backgroundColor: props.color }}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', wordBreak: 'break-word'}}>
                    <span style={{textAlign: 'center', display: 'inline-block'}}>
                        {props.name}
                    </span>
                </div>
            </RowHeader>
            <SortableContext items={props.items} strategy={rectSortingStrategy}>
                <div style={itemsContainerStyles} ref={setNodeRef}>
                    {props.items.map((item) => {
                        return <Item key={item.id} id={item.id} path={item.path} disabled={props.disabled}></Item>
                    })}
                </div>
            </SortableContext>
        </div>
    );
};

export default Row;