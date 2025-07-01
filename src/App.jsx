import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RefreshCw, BarChart3, Heart } from 'lucide-react';

const App = () => {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(50);
  const [sortingSpeed, setSortingSpeed] = useState(1);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(0);
  const [isSorting, setIsSorting] = useState(false);
  const [comparingIndices, setComparingIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [currentIndices, setCurrentIndices] = useState([]);
  const [minIndex, setMinIndex] = useState(null);
  const cancelRef = useRef(false);

  const algorithms = [
    'Choose Algorithm',
    'Bubble Sort',
    'Selection Sort',
    'Insertion Sort',
    'Merge Sort',
    'Quick Sort'
  ];

  const speeds = [
    { label: '0.50x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: '1.00x', value: 1 },
    { label: '2.00x', value: 2 },
    { label: '4.00x', value: 4 }
  ];

  const arraySizes = [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  // Helper functions
  const generateRandomArray = useCallback(() => {
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * 100) + 1);
    }
    setArray(newArray);
    setSortedIndices([]);
    setComparingIndices([]);
    setCurrentIndices([]);
    setMinIndex(null);
  }, [arraySize]);

  useEffect(() => {
    generateRandomArray();
  }, [arraySize, generateRandomArray]);

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const getDelay = () => {
    return 400 / sortingSpeed;
  };

  const swap = async (arr, i, j) => {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    setArray([...arr]);
    await sleep(getDelay());
  };

  // Sorting algorithms
  const bubbleSort = async () => {
    const arr = [...array];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (cancelRef.current) return;
        
        setComparingIndices([j, j + 1]);
        await sleep(getDelay());
        
        if (arr[j] > arr[j + 1]) {
          await swap(arr, j, j + 1);
        }
        
        setComparingIndices([]);
      }
      setSortedIndices(prev => [...prev, arr.length - i - 1]);
    }
    setSortedIndices(prev => [...prev, 0]);
  };

  const selectionSort = async () => {
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      if (cancelRef.current) return;
      
      let minIdx = i;
      setMinIndex(i);
      
      for (let j = i + 1; j < arr.length; j++) {
        if (cancelRef.current) return;
        
        setComparingIndices([j]);
        await sleep(getDelay());
        
        if (arr[j] < arr[minIdx]) {
          setMinIndex(j);
          minIdx = j;
        }
      }
      
      setComparingIndices([i, minIdx]);
      await sleep(getDelay());
      await swap(arr, i, minIdx);
      
      setSortedIndices(prev => [...prev, i]);
      setComparingIndices([]);
      setMinIndex(null);
    }
  };

  const insertionSort = async () => {
    const arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      if (cancelRef.current) return;
      
      let j = i;
      while (j > 0 && arr[j - 1] > arr[j]) {
        if (cancelRef.current) return;
        
        setComparingIndices([j - 1, j]);
        await sleep(getDelay());
        await swap(arr, j - 1, j);
        j--;
      }
      setComparingIndices([]);
    }
    
    for (let i = 0; i < arr.length; i++) {
      setSortedIndices(prev => [...prev, i]);
    }
  };

  const merge = async (arr, start, mid, end) => {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);
    
    let i = 0, j = 0, k = start;
    
    // Highlight the section being merged
    const highlightIndices = [];
    for (let idx = start; idx <= end; idx++) {
      highlightIndices.push(idx);
    }
    setCurrentIndices(highlightIndices);
    
    while (i < left.length && j < right.length) {
      if (cancelRef.current) return;
      
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      k++;
      setArray([...arr]);
      await sleep(getDelay());
    }
    
    while (i < left.length) {
      if (cancelRef.current) return;
      arr[k] = left[i];
      i++;
      k++;
      setArray([...arr]);
      await sleep(getDelay());
    }
    
    while (j < right.length) {
      if (cancelRef.current) return;
      arr[k] = right[j];
      j++;
      k++;
      setArray([...arr]);
      await sleep(getDelay());
    }
    
    setCurrentIndices([]);
  };

  const mergeSortHelper = async (arr, start, end) => {
    if (start >= end || cancelRef.current) return;
    
    const mid = Math.floor((start + end) / 2);
    await mergeSortHelper(arr, start, mid);
    await mergeSortHelper(arr, mid + 1, end);
    await merge(arr, start, mid, end);
  };

  const mergeSort = async () => {
    const arr = [...array];
    await mergeSortHelper(arr, 0, arr.length - 1);
    
    if (!cancelRef.current) {
      for (let i = 0; i < arr.length; i++) {
        setSortedIndices(prev => [...prev, i]);
      }
    }
  };

  const partition = async (arr, low, high) => {
    const pivot = arr[high];
    let i = low - 1;
    
    setMinIndex(high); // Highlight pivot
    
    for (let j = low; j < high; j++) {
      if (cancelRef.current) return i;
      
      setComparingIndices([j]);
      await sleep(getDelay());
      
      if (arr[j] < pivot) {
        i++;
        setComparingIndices([i, j]);
        await sleep(getDelay());
        await swap(arr, i, j);
      }
      setComparingIndices([]);
    }
    
    await swap(arr, i + 1, high);
    setMinIndex(null);
    return i + 1;
  };

  const quickSortHelper = async (arr, low, high) => {
    if (low < high && !cancelRef.current) {
      const pi = await partition(arr, low, high);
      await quickSortHelper(arr, low, pi - 1);
      await quickSortHelper(arr, pi + 1, high);
    }
  };

  const quickSort = async () => {
    const arr = [...array];
    await quickSortHelper(arr, 0, arr.length - 1);
    
    if (!cancelRef.current) {
      for (let i = 0; i < arr.length; i++) {
        setSortedIndices(prev => [...prev, i]);
      }
    }
  };

  const startSorting = async () => {
    if (selectedAlgorithm === 0) {
      alert('Please select an algorithm');
      return;
    }
    
    setIsSorting(true);
    cancelRef.current = false;
    setSortedIndices([]);
    setComparingIndices([]);
    setCurrentIndices([]);
    setMinIndex(null);
    
    try {
      switch (selectedAlgorithm) {
        case 1:
          await bubbleSort();
          break;
        case 2:
          await selectionSort();
          break;
        case 3:
          await insertionSort();
          break;
        case 4:
          await mergeSort();
          break;
        case 5:
          await quickSort();
          break;
      }
    } catch (error) {
      console.error('Sorting error:', error);
    } finally {
      setIsSorting(false);
      if (cancelRef.current) {
        generateRandomArray();
      }
    }
  };

  const stopSorting = () => {
    cancelRef.current = true;
  };

  const getBarColor = (index) => {
    if (sortedIndices.includes(index)) return 'bg-green-500';
    if (index === minIndex) return 'bg-pink-500';
    if (comparingIndices.includes(index)) return 'bg-blue-500';
    if (currentIndices.includes(index)) return 'bg-cyan-500';
    return 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-700 dark:to-teal-800 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 
              className="text-2xl font-bold text-white cursor-pointer flex items-center gap-2 hover:scale-105 transition-transform"
              onClick={generateRandomArray}
            >
              <BarChart3 className="w-6 h-6" />
              Sorting Visualizer
            </h1>
          </div>
        </div>
      </header>

      {/* Controls */}
      <nav className="bg-teal-700 dark:bg-teal-800 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 py-4">
            <button
              onClick={generateRandomArray}
              disabled={isSorting}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generate Array
            </button>

            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(Number(e.target.value))}
              disabled={isSorting}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {algorithms.map((algo, index) => (
                <option key={index} value={index}>
                  {algo}
                </option>
              ))}
            </select>

            <select
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              disabled={isSorting}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <option value={0} disabled>Array Size</option>
              {arraySizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <select
              value={sortingSpeed}
              onChange={(e) => setSortingSpeed(Number(e.target.value))}
              disabled={isSorting}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <option value={0} disabled>Speed</option>
              {speeds.map((speed) => (
                <option key={speed.value} value={speed.value}>
                  {speed.label}
                </option>
              ))}
            </select>

            {!isSorting ? (
              <button
                onClick={startSorting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all flex items-center gap-2 font-medium"
              >
                <Play className="w-4 h-4" />
                Sort
              </button>
            ) : (
              <button
                onClick={stopSorting}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all flex items-center gap-2 font-medium"
              >
                <Pause className="w-4 h-4" />
                Stop
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Visualization Area */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 min-h-[400px]">
          <div className="flex items-end justify-center h-96 gap-1">
            {array.map((value, index) => (
              <div
                key={index}
                className={`transition-all duration-300 rounded-t-md ${getBarColor(index)}`}
                style={{
                  height: `${(value / 100) * 100}%`,
                  width: `${100 / array.length}%`,
                  maxWidth: '60px'
                }}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1">
              Created with <Heart className="w-4 h-4 text-red-500 fill-current" /> by Subham
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <a
                href="https://www.linkedin.com/in/dharshakch97/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/dharshakch97"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;