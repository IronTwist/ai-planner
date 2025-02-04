'use client';

import { useAppSelector } from '@/store/hooks';
import { useCallback, useEffect, useState } from 'react';
import { pushupsRepository } from '../repositories/pushups';
import { FaArrowsRotate, FaDeleteLeft } from 'react-icons/fa6';
import { levels } from '@/utils';
import { Box } from '@mui/material';

const programs = levels;

export type DataType = {
  data: {
    id: string;
    date: number;
    name: string;
    total: number;
    programLevel: number;
    set1: number;
    set2: number;
    set3: number;
    set4: number;
    set5: number;
  }[];
  count: number;
};

export default function PushUpsApp() {
  const user = useAppSelector(state => state.auth.user);

  const [data, setData] = useState<DataType>();
  const [selectedProgram, setSelectedProgram] = useState(programs[0]);
  const [currentSet, setCurrentSet] = useState(1);
  const [targetPushups, setTargetPushups] = useState(selectedProgram.set1);
  const [remainingPushups, setRemainingPushups] = useState(
    selectedProgram.set1,
  );
  const [onBreak, setOnBreak] = useState(false);
  const [breakTime, setBreakTime] = useState(selectedProgram.breakTime);
  const [breakTimer, setBreakTimer] = useState(selectedProgram.breakTime);
  const [disabledForASecond, setDisabledForASecond] = useState(false);
  // const fileInputRef = useRef(null);
  const [currentPushupsTotal, setCurrentPushupsTotal] = useState(0);

  const handleChangeProgram = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLevel = parseInt(event.target.value, 10);
    const program = programs.find(p => p.seriesLevel === selectedLevel);
    if (program) setSelectedProgram(program);
  };

  useEffect(() => {
    if (onBreak && breakTimer > 0) {
      const timer = setInterval(() => {
        setBreakTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (breakTimer === 0) {
      proceedToNextSet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onBreak, breakTimer]);

  const proceedToNextSet = () => {
    setOnBreak(false);
    setBreakTimer(breakTime);
    const nextSet = currentSet + 1;
    if (nextSet < 6) {
      setCurrentSet(nextSet);
      setTargetPushups(
        selectedProgram[`set${nextSet}` as keyof typeof selectedProgram],
      );
      setRemainingPushups(
        selectedProgram[`set${nextSet}` as keyof typeof selectedProgram],
      );
    }
  };

  const handlePushup = () => {
    setDisabledForASecond(true);
    if (remainingPushups > 0) {
      setCurrentPushupsTotal(prev => prev + 1);
      setRemainingPushups(prev => prev - 1);
    }

    if (remainingPushups === 1) {
      if (currentSet === 5) {
        setOnBreak(false);
      } else {
        setOnBreak(true);
      }
    }

    setTimeout(() => {
      setDisabledForASecond(false);
    }, 50);
  };

  const startAgain = useCallback(() => {
    setCurrentSet(1);
    setTargetPushups(selectedProgram.set1);
    setRemainingPushups(selectedProgram.set1);
    setBreakTime(selectedProgram.breakTime);
    setBreakTimer(selectedProgram.breakTime);
    setCurrentPushupsTotal(0);
  }, [selectedProgram.breakTime, selectedProgram.set1]);

  useEffect(() => {
    startAgain();
  }, [selectedProgram, startAgain]);

  const handleSubmit = async () => {
    const { set1, set2, set3, set4, set5, seriesLevel } = selectedProgram;
    let latestMaxPushUps = 0;

    if (data?.count) {
      latestMaxPushUps = data?.data[0].total;
    } else {
      latestMaxPushUps = 0;
    }

    const workout = {
      name: user?.userName as string,
      programLevel: seriesLevel,
      set1,
      set2,
      set3,
      set4,
      set5,
      total: latestMaxPushUps
        ? latestMaxPushUps + selectedProgram.total
        : selectedProgram.total,
      date: Date.now(),
    };

    const resp = await pushupsRepository.addWorkout(user, workout);

    if (resp) {
      loadData();
    }
  };

  const handleGiveUpSubmit = async () => {
    const isConfirmed = window.confirm('Are you sure you want to giveup?');
    if (!isConfirmed) {
      return;
    }

    const { set1, set2, set3, set4, set5, seriesLevel } = selectedProgram;
    let latestMaxPushUps = 0;

    if (data?.count) {
      latestMaxPushUps = data?.data[0].total;
    } else {
      latestMaxPushUps = 0;
    }

    const workout = {
      name: user?.userName as string,
      programLevel: seriesLevel,
      set1,
      set2,
      set3,
      set4,
      set5,
      total: latestMaxPushUps
        ? latestMaxPushUps + currentPushupsTotal
        : currentPushupsTotal,
      date: Date.now(),
    };

    const resp = await pushupsRepository.addWorkout(user, workout);

    if (resp) {
      loadData();
    }
  };

  const downloadCSV = () => {
    if (!data?.data) return;

    const csvHeader =
      'Name,Program Level,Set1,Set2,Set3,Set4,Set5,Total Pushups,Date\n';
    const csvRows = data.data.map(
      row =>
        `${user?.userName},${selectedProgram.seriesLevel},${row.set1},${row.set2},${row.set3},${row.set4},${row.set5},${row.total},${new Date().toISOString()}`,
    );

    const csvContent = csvHeader + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pushups_data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
  //   const file = event?.target?.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = async e => {
  //     const text = e.target?.result;
  //     if (typeof text === 'string') {
  //       const rows = text.split('\n').slice(1); // Skip header
  //       console.log('upload: ', rows);

  //       if (rows.length > 0) {
  //         const resp = await fetch('/api/pushups/load', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ rows }),
  //         });

  //         if (resp.status === 200) {
  //           loadData();
  //         }
  //       }
  //     }
  //   };
  //   reader.readAsText(file);
  // };

  const removeWorkout = async (id: string) => {
    const selectedRow = data?.data.filter(row => row.id === id);
    const workoutInfo = `${formatDate(new Date(selectedRow?.[0].date ? selectedRow[0].date : 'now').toISOString())} Level ${selectedRow?.[0].programLevel}`;

    const isConfirmed = window.confirm(
      `Are you sure you want to remove workout ${workoutInfo}?`,
    );
    if (!isConfirmed) {
      return;
    }
    await pushupsRepository.removeWorkout(user, id);
    await loadData();
  };

  const loadData = async () => {
    // TODO: This should be used in middleware on loading app, preload all data inside redux store, until then it will have to laod it manualy from db
    const data = await pushupsRepository.getSeries(user);
    setData({ data: data.data, count: data.data.length });
  };

  useEffect(() => {
    if (data?.data[0]?.programLevel) {
      setSelectedProgram(() => programs[data.data[0].programLevel - 1]);
    }
  }, [data]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      await loadData();
    }, 500);

    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 pt-24 bg-cyan-900 bg-cover bg-[url("/images/pushups.webp")]'>
      <h1 className='text-2xl font-bold mb-4 text-orange-400 bg-black p-2'>
        Push Ups Workout Tracker{' '}
      </h1>
      <label htmlFor='programs' className='block text-lg font-medium mb-2'>
        Select Level:
      </label>
      <select
        id='programs'
        value={selectedProgram.seriesLevel}
        onChange={handleChangeProgram}
        className='p-2 border rounded-md text-black'
      >
        {programs.map(program => (
          <option
            className='text-black'
            key={program.seriesLevel}
            value={program.seriesLevel}
          >
            {`Level ${program.seriesLevel} (${program.set1}+${program.set2}+${program.set3}+${program.set4}+${program.set5}=${program.total})`}
          </option>
        ))}
      </select>

      <h2 className='flex text-xl gap-3 mb-4 mt-4 p-4 border rounded-md bg-blue-600'>
        <div>
          Set {currentSet}: Target Pushups: {targetPushups}{' '}
          <p>Break Time: {selectedProgram.breakTime} seconds</p>
          <p>Current total: {currentPushupsTotal}</p>
        </div>
        {remainingPushups !== 0 && (
          <div className='flex gap-2'>
            <button
              onClick={handleGiveUpSubmit}
              className='h-12 px-4 py-2 border border-black bg-green-300 text-cyan-800 text-xl rounded hover:bg-green-600'
            >
              Give up
            </button>
            <button
              onClick={startAgain}
              className='h-12 px-4 py-2 border border-black bg-green-300 text-cyan-800 text-xl rounded hover:bg-green-600'
            >
              Reset
            </button>
          </div>
        )}
      </h2>

      {!onBreak ? (
        <div className='flex flex-col items-center'>
          <button
            disabled={disabledForASecond}
            onClick={handlePushup}
            className='w-80 h-80 px-6 py-2 border border-spacing-8 border-y-8 border-x-8 border-yellow-300 bg-blue-500 text-white shrink-0 grow-0 rounded-full hover:bg-blue-500'
          >
            <div className='text-9xl font-bold'>
              {remainingPushups === 0 ? (
                <div className='text-5xl'>Congrats!</div>
              ) : (
                remainingPushups
              )}
            </div>
          </button>
        </div>
      ) : (
        <div className='flex flex-col items-center'>
          <button
            onClick={proceedToNextSet}
            className='w-80 h-80 px-6 py-2 border border-y-8 border-x-8 border-blue-500 bg-yellow-500 text-white rounded-full hover:bg-yellow-500'
          >
            <h2 className='text-xl mb-4 text-cyan-950'>Break Time!</h2>
            <h2 className='text-8xl font-bold mb-6 text-cyan-950'>
              {breakTimer} <span className='text-2xl -ml-6'>sec</span>
            </h2>
            Touch to continue!
          </button>
        </div>
      )}

      {remainingPushups === 0 && currentSet === 5 && (
        <div className='flex gap-2'>
          <button
            onClick={handleSubmit}
            className='mt-6 px-4 py-2 border border-black bg-green-300 text-cyan-800 text-xl rounded hover:bg-green-600'
          >
            Save workout
          </button>
          <button
            className='mt-6 px-4 py-2 border border-black bg-green-300 text-cyan-800 text-xl rounded hover:bg-green-600'
            onClick={startAgain}
          >
            Start again
          </button>
        </div>
      )}

      <Box className='flex flex-col w-full px-2'>
        <button
          className='flex px-4 py-2 border border-black bg-green-300 text-cyan-800 text-xl rounded items-center gap-3 hover:bg-green-600 w-44'
          onClick={async () => await loadData()}
        >
          {<FaArrowsRotate />}Get my data
        </button>
        <table className='w-full mt-8 border-collapse border-2 border-black text-1xl text-cyan-800 bg-slate-400'>
          <thead className='bg-gray-300'>
            <tr className='border-2 border-black'>
              <th className='border-2 border-black px-4 py-2 text-left'>
                Date
              </th>
              <th className='border-2 border-black px-4 py-2 text-left'>
                Workout Level
              </th>
              <th className='border-2 border-black px-4 py-2 text-left'>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data &&
              data.data.map((row, index) => (
                <tr key={index} className='border-2 border-black'>
                  <td className='border-2 border-black px-4 py-2'>
                    {formatDate(new Date(row.date).toISOString())}
                  </td>
                  <td className='border-2 border-black px-4 py-2'>
                    {`${row.programLevel} (${row.set1}+${row.set2}+${row.set3}+${row.set4}+${row.set5}=${row.set1 + row.set2 + row.set3 + row.set4 + row.set5})`}
                  </td>
                  <td className='border-2 border-black px-4 py-2'>
                    <div className='flex items-center justify-between gap-2'>
                      {row.total}
                      {
                        <FaDeleteLeft
                          onClick={() => {
                            removeWorkout(row.id);
                          }}
                          size={30}
                        />
                      }
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Box>

      <div className='flex gap-2 mt-3'>
        {/* <div>
          <input
            id='fileUpload'
            type='file'
            ref={fileInputRef}
            accept='.csv'
            onChange={e => handleFileUpload(e)}
            className='hidden'
          />
          <label
            htmlFor='fileUpload'
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Upload from device
          </label>
        </div> */}
        <div
          onClick={downloadCSV}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Save to device
        </div>
      </div>
    </div>
  );
}

const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  // Format date: "31 January 2025"
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Format time: "13:35"
  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
  });

  return `${formattedDate} - ${formattedTime}`;
};
