import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Row from './row';
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import styled from 'styled-components';
import Item from './item';
import Tray from './tray';
import initialData from '.initial-data';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  max-width: 1000px;
  background: #1d2121;
  padding: 4px;
`;

const TierListHeader = styled.h1`
  margin-bottom: 3rem;
`;

const TierList = (props) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [data, setData] = useState(JSON.parse(initialData));
  const [activeId, setActiveId] = useState(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (activeContainer && overContainer) {
      setData((prevData) => {
        const activeItems = activeContainer === 'tray'
          ? prevData.tray.items
          : prevData.rows.find(row => row.id.toString() === activeContainer).items;

        const overItems = overContainer === 'tray'
          ? prevData.tray.items
          : prevData.rows.find(row => row.id.toString() === overContainer).items;

        const activeIndex = activeItems.indexOf(active.id);
        const overIndex = overItems.indexOf(over.id);

        let newActiveItems = [...activeItems];
        let newOverItems = [...overItems];

        if (activeContainer === overContainer) {
          newActiveItems = arrayMove(activeItems, activeIndex, overIndex);
        } else {
          newActiveItems.splice(activeIndex, 1);
          if (overIndex === -1) {
            newOverItems.push(active.id);
          } else {
            newOverItems.splice(overIndex, 0, active.id);
          }
        }
        let trayItems = prevData.tray.items;

        if (activeContainer == 'tray') {
          trayItems = newActiveItems;
        }

        else if (overContainer == 'tray') {
          trayItems = newOverItems;
        }

        return {
          ...prevData,
          tray: { items: trayItems },
          rows: prevData.rows.map(row => {
            if (row.id === activeContainer) {
              return { ...row, items: newActiveItems };
            }
            if (row.id === overContainer) {
              return { ...row, items: newOverItems };
            }

            return row;
          })
        };
      });
    }

    const dataInput = document.querySelector('input[name="data"]');
    dataInput.value = JSON.stringify(data);
    setActiveId(null);
  };

  const findContainer = (id) => {
    if (id.includes('tier-')) {
      return data.rows.find(row => row.id.toString() === id).id;
    }
    if (id == 'tray') {
      return 'tray';
    }
    if (data.tray.items.includes(id)) {
      return 'tray';
    }
    for (const row of data.rows) {
      if (row.items.includes(id.toString())) {
        return row.id.toString();
      }
    }
    return null;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over, draggingRect } = event;
    const { id: activeId } = active;
    if (!over) return;

    const { id: overId } = over;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setData((prevData) => {
      const activeItems = activeContainer === 'tray'
        ? prevData.tray.items
        : prevData.rows.find(row => row.id === activeContainer).items;

      const overItems = overContainer === 'tray'
        ? prevData.tray.items
        : prevData.rows.find(row => row.id.toString() === overContainer).items;

      const activeIndex = activeItems.indexOf(activeId);
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prevData) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          draggingRect?.offsetTop > over.rect.offsetTop + over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }


      if (activeContainer === 'tray') {
      }
      return {
        ...prevData,
        tray: activeContainer === 'tray' ? {
          items: [
            ...prevData.tray.items.filter(item => item !== activeId),
          ]
        } : overContainer === 'tray' ? {
          items: [...prevData.tray.items, activeId]
        } : prevData.tray,
        rows: prevData.rows.map(row => {
          if (row.id.toString() === activeContainer) {
            return {
              ...row, items: [
                ...prevData.rows.find(row => row.id.toString() === activeContainer).items.filter(item => item !== activeId),
              ]
            };
          }
          if (row.id.toString() === overContainer) {
            return {
              ...row, items: [
                ...prevData.rows.find(row => row.id.toString() == overContainer).items.slice(0, newIndex),
                activeId,
                ...prevData.rows.find(row => row.id.toString() == overContainer).items.slice(newIndex, prevData.rows.find(row => row.id.toString() === overContainer).items.length),
              ]
            };
          }
          return row;
        })
      };
    });
  };

  return (
    <div>
      <TierListHeader>{data.name}</TierListHeader>

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      >
        <Container>
          <SortableContext items={data.rows}>
            {data.rows.map((row) => {
              const rowItems = row.items.map((item) => data.items[item]);
              return <Row key={row.id} id={row.id} name={row.name} color={row.color} items={rowItems} disabled={props.disabled} />;
            })}
          </SortableContext>
        </Container>
        <SortableContext items={data.tray.items.map(item => data.items[item])}>
          <Tray key="tray" id="tray" items={data.tray.items.map(item => data.items[item])} disabled={props.disabled}></Tray>
        </SortableContext>
        <DragOverlay>
          {props.disabled?.trim() != 'true' && activeId ? <Item id={activeId} path={data.items[activeId].path} /> : null}
        </DragOverlay>
      </DndContext>
    </div >
  );
};

export default TierList;