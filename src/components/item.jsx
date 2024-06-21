import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 40%;
  min-width: 108px;
  max-width: 108px;
  height: 100px;
`;

const Item = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.id, disabled: props.disabled?.trim() == "true" });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundImage: `url(` + props.path + `)`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        boxShadow: isDragging ? "0px 0px 9px 1px #000000" : "none",
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Container></Container>
        </div>
    );
};

export default Item;
