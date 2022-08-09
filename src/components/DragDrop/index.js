import React, { useState, useCallback, useRef } from 'react';
import { Table } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
const type = 'DragableBodyRow';

const DragableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop(
    () => ({
      accept: type,
      collect: (monitor) => {
        const { index: dragIndex } = monitor.getItem() || {};
        if (dragIndex === index) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName:
            dragIndex < index ? 'drop-over-downward' : 'drop-over-upward',
        };
      },
      drop: (item) => {
        moveRow(item.index, index);
      },
    }),
    [index]
  );

  const [, drag] = useDrag(
    () => ({
      type,
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index]
  );
  drop(drag(ref));
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    ></tr>
  );
};

const DragDrop = ({ dataList }) => {
  const columns = React.useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        id: 'id',
      },

      {
        title: 'Photo',
        dataIndex: 'photo',
        id: 'photo',
      },
      {
        title: 'Title',
        dataIndex: 'title',
        id: 'title',
      },
      {
        title: 'Username',

        dataIndex: 'username',
        id: 'username',
      },
      {
        title: 'Like',
        dataIndex: 'like',
        id: 'like',
      },
    ],

    []
  );

  const newDataList = dataList.map((data) => {
    const { id, like, photo, title, username } = data;
    return { id, like, photo, title, username };
  });
  const compiledData = React.useMemo(
    () => [...newDataList],

    []
  );
  const [data, setData] = useState(compiledData);

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        })
      );
    },
    [data]
  );

  return (
    <div className='container mt-5'>
      <DndProvider backend={HTML5Backend}>
        <Table
          columns={columns}
          dataSource={data}
          components={components}
          onRow={(record, index) => ({ index, moveRow })}
        />
      </DndProvider>
    </div>
  );
};

export default DragDrop;
