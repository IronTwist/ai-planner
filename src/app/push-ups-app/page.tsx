'use client';

import { useAppSelector } from '@/store/hooks';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

export default function PushUpsApp() {
  const user = useAppSelector(state => state.auth.user);

  const [data, setData] = useState<{
    data: {
      date: string;
      name: string;
      totalPushups: string;
      programLevel: string;
      pushups: {
        set1: string;
        set2: string;
        set3: string;
        set4: string;
        set5: string;
      };
    }[];
    count: number;
  }>();
  const [selectedProgram] = useState({
    seriesLevel: 1,
    set1: 10,
    set2: 9,
    set3: 8,
    set4: 8,
    set5: 9,
    breakTime: 45,
  });
  const [currentSet, setCurrentSet] = useState(1);
  const [targetPushups, setTargetPushups] = useState(selectedProgram.set1);
  const [remainingPushups, setRemainingPushups] = useState(
    selectedProgram.set1,
  );
  const [onBreak, setOnBreak] = useState(false);
  const [breakTime] = useState(selectedProgram.breakTime);
  const [breakTimer, setBreakTimer] = useState(selectedProgram.breakTime);
  const [disabledForASecond, setDisabledForASecond] = useState(false);
  const fileInputRef = useRef(null);

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

  const startAgain = () => {
    setCurrentSet(1);
    setTargetPushups(selectedProgram.set1);
    setRemainingPushups(selectedProgram.set1);
  };

  const handleSubmit = async () => {
    const { set1, set2, set3, set4, set5, seriesLevel } = selectedProgram;
    console.log('Submit username: ', user?.userName);
    const data = {
      name: user?.userName,
      programLevel: seriesLevel,
      pushups: {
        set1,
        set2,
        set3,
        set4,
        set5,
      },
    };

    const resp = await fetch('http://127.0.0.1:3000/api/pushups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (resp.status === 200) {
      loadData();
    }
  };

  const downloadCSV = () => {
    if (!data?.data) return;

    const csvHeader =
      'Name,Program Level,Set1,Set2,Set3,Set4,Set5,Total Pushups,Date\n';
    const csvRows = data.data.map(
      row =>
        `${user?.userName},${selectedProgram.seriesLevel},${row.pushups.set1},${row.pushups.set2},${row.pushups.set3},${row.pushups.set4},${row.pushups.set5},${row.totalPushups},${new Date().toISOString()}`,
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

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async e => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        const rows = text.split('\n').slice(1); // Skip header
        console.log('upload: ', rows);

        if (rows.length > 0) {
          const resp = await fetch('http://127.0.0.1:3000/api/pushups/load', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rows }),
          });

          if (resp.status === 200) {
            loadData();
          }
        }
      }
    };
    reader.readAsText(file);
  };

  const loadData = () => {
    fetch(`http://127.0.0.1:3000/api/pushups?name=${user?.userName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(data => data.json())
      .then(data => {
        console.log('Data test: ', data);
        setData(data);
      });
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      loadData();
    }, 1000);

    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 gap-6 pt-24 bg-cyan-900'>
      <h1 className='text-2xl font-bold mb-4'>Push-Up Tracker</h1>
      <h2 className='text-xl mb-4'>
        Set {currentSet}: Target Pushups: {targetPushups}
      </h2>

      {!onBreak ? (
        <div className='flex flex-col items-center'>
          <button
            disabled={disabledForASecond}
            onClick={handlePushup}
            className='w-80 h-80 px-6 py-2 border border-spacing-8 border-y-8 border-x-8 border-yellow-300 bg-blue-500 text-white shrink-0 grow-0 rounded-full hover:bg-blue-600'
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
            className='w-80 h-80 px-6 py-2 border border-y-8 border-x-8 border-blue-500 bg-yellow-500 text-white rounded-full hover:bg-yellow-600'
          >
            <h2 className='text-xl mb-4 text-cyan-950'>Break Time!</h2>
            <h2 className='text-9xl font-bold mb-6 text-cyan-950'>
              {breakTimer} <span className='text-2xl -ml-8'>sec</span>
            </h2>
            Click to continue!
          </button>
        </div>
      )}

      {remainingPushups === 0 && currentSet === 5 && (
        <>
          <button
            onClick={handleSubmit}
            className='mt-6 px-4 py-2 border border-black bg-green-500 text-white rounded hover:bg-green-600'
          >
            Save workout
          </button>
          <button onClick={startAgain}>Start again</button>
        </>
      )}
      <table className='w-full border-collapse border-2 border-black text-2xl text-cyan-800 bg-slate-400'>
        <thead className='bg-gray-300'>
          <tr className='border-2 border-black'>
            <th className='border-2 border-black px-4 py-2 text-left'>Date</th>
            <th className='border-2 border-black px-4 py-2 text-left'>Total</th>
          </tr>
        </thead>
        <tbody>
          {data?.data &&
            data.data.map((row, index) => (
              <tr key={index} className='border-2 border-black'>
                <td className='border-2 border-black px-4 py-2'>
                  {formatDate(row.date)}
                </td>
                <td className='border-2 border-black px-4 py-2'>
                  {row.totalPushups}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className='flex gap-2'>
        <div>
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
        </div>
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

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  return date.toLocaleString('en-GB', options).replace(',', '');
};
