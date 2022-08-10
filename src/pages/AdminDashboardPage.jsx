import React, { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import MkdSDK from '../utils/MkdSDK';
import { FiLogOut } from 'react-icons/fi';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useCallback } from 'react';
import { Table } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { useNavigate } from 'react-router';
import { AuthContext } from '../authContext';
const type = 'DragableBodyRow';

const AdminDashboardPage = () => {
  let sdk = new MkdSDK();
  const navigate = useNavigate();
  const { dispatch } = React.useContext(AuthContext);
  const [dataLoad, setDataLoad] = useState({});
  const [dataList, setDataList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const fetchNextVideos = useRef(() => {});

  fetchNextVideos.current = () => {
    getVideos(pageNumber).then((videoList) => {
      if (videoList === undefined) return;
      setDataLoad(videoList);
      setDataList(videoList.list);
    });
  };

  const getVideos = async (pageNumber, limit) => {
    sdk.setTable('video');
    const body = {
      payload: {},
      page: pageNumber || 1,
      limit: limit || 10,
    };
    const videoList = await sdk.callRestAPI(body, 'PAGINATE');
    return videoList;
  };

  useEffect(() => {
    fetchNextVideos.current();
  }, [pageNumber]);

  // Drag & Drop with Ant Design Table
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
          render: (text, record) => (
            <img alt={record.username} src={record.photo} />
          ),
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

    const components = {
      body: {
        row: DragableBodyRow,
      },
    };

    const moveRow = useCallback(
      (dragIndex, hoverIndex) => {
        const dragRow = dataList[dragIndex];
        setDataList(
          update(dataList, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, dragRow],
            ],
          })
        );
      },
      [dataList]
    );

    return (
      <div className='container mt-5'>
        <DndProvider backend={HTML5Backend}>
          <Table
            columns={columns}
            dataSource={newDataList}
            components={components}
            onRow={(record, index) => ({ index, moveRow })}
            pagination={false}
          />
        </DndProvider>
      </div>
    );
  };
  // End of Drag & Drop with Ant Design Table

  return (
    <>
      <section className='w-full flex flex-col p-6 items-center min-h-screen bg-black text-white py-4 px-12 gap-8'>
        <div className='w-full flex  justify-between p-2 '>
          <p className='text-5xl'>APP</p>
          <button onClick={() => {
                dispatch({ type: 'LOGOUT' });
                navigate('/admin/login');
              }} className='bg-teal-800 px-12 rounded-2xl flex gap-2 py-0 items-center'>
            <span>
              <FiLogOut />
            </span>

            <span
              
            >
              Logout{' '}
            </span>
          </button>
        </div>

        <div className='flex flex-col gap-4 min-h-max'>
          <p className='text-3xl'>Today's leaderboard</p>
          {dataList.length > 1 ? <DragDrop dataList={dataList} /> : ''}
        </div>
        <footer>
          <div className='bg-white text-black text-lg flex gap-2 p-2'>
            <button
              className='p-2'
              onClick={() =>
                !pageNumber < 1 && setPageNumber(dataLoad.page - 1)
              }
            >
              <FaAngleLeft />
            </button>
            <span className='p-2'>{dataLoad.page}</span>
            <button
              className='p-2'
              onClick={() => setPageNumber(dataLoad.page + 1)}
            >
              <FaAngleRight />
            </button>
          </div>
        </footer>
      </section>
    </>
  );
};

export default AdminDashboardPage;
