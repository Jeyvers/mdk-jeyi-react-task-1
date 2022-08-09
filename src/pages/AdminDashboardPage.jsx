import React, { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import MkdSDK from '../utils/MkdSDK';
import { FiLogOut } from 'react-icons/fi';
import DragDrop from '../components/DragDrop';

const AdminDashboardPage = () => {
  let sdk = new MkdSDK();
  const [dataLoad, setDataLoad] = useState({});
  const [dataList, setDataList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const fetchNextVideos = useRef(() => {});

  fetchNextVideos.current = () => {
    getVideos(pageNumber).then((videoList) => {
      if (videoList === undefined) return;
      setDataLoad(videoList);
      setDataList(videoList.list);
      console.log(dataList);
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

  return (
    <>
      <section className='w-full flex flex-col p-6 items-center min-h-screen bg-black text-white py-4 px-12 gap-8'>
        <div className='w-full flex  justify-between p-2 '>
          <p className='text-5xl'>APP</p>
          <button className='bg-teal-800 py-2 px-8 rounded-2xl flex gap-2 items-center'>
            <span>
              <FiLogOut />
            </span>
            <span>Logout </span>
          </button>
        </div>

        <div className='flex flex-col gap-4 min-h-max'>
          <p className='text-3xl'>Today's leaderboard</p>
          {dataList.length > 1 ? <DragDrop dataList={dataList} /> : ''}
        </div>
      </section>
      <footer>
        <div>
          <button
            className='text-3xl'
            onClick={() => !pageNumber < 1 && setPageNumber(dataLoad.page - 1)}
          >
            Fetch Prev Data
          </button>

          <button
            className='text-3xl'
            onClick={() => setPageNumber(dataLoad.page + 1)}
          >
            Fetch Next Data
          </button>
        </div>
      </footer>
    </>
  );
};

export default AdminDashboardPage;
