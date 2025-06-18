// components/Benchmark.tsx
import React, { useState, useMemo, memo, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { createSignal } from "../../src/core/signals";
import { S } from "../../src/components/S";

// --- Benchmark Configuration ---
const GRID_SIZE = 50; // 50x50 = 2500 cells
const CELL_COUNT = GRID_SIZE * GRID_SIZE;

// --- Generic Cell ---
// Used by both approaches to highlight the updated cell.
const GenericCell = memo(
  ({
    children,
    isUpdated,
  }: {
    children: React.ReactNode;
    isUpdated: boolean;
  }) => {
    return (
      <div
        className={`w-5 h-5 text-xs flex items-center justify-center border border-white transition-colors duration-500 ${isUpdated ? "bg-red-300" : "bg-slate-100"}`}
      >
        {children}
      </div>
    );
  },
);

// --- Signals Approach ---
const SignalBenchmark = ({ setPerfData }: { setPerfData: Function }) => {
  const [lastUpdated, setLastUpdated] = useState(-1);
  const gridSignals = useMemo(
    () => Array.from({ length: CELL_COUNT }, () => createSignal(0)),
    [],
  );

  const handleUpdate = () => {
    const randomIndex = Math.floor(Math.random() * CELL_COUNT);
    const signalToUpdate = gridSignals[randomIndex];

    // Show which cell was updated
    setLastUpdated(randomIndex);
    setTimeout(() => setLastUpdated(-1), 1000); // Clear the highlight

    const startTime = performance.now();
    signalToUpdate.set(signalToUpdate.peek() + 1);
    const endTime = performance.now();

    setPerfData("signal", endTime - startTime);
  };

  console.log("Rendering PARENT: SignalBenchmark (only on mount)");
  return (
    <div className="benchmark-container">
      <div className="explanation">
        <h3 className="font-bold text-lg mb-2">How It Works (Signals)</h3>
        <p className="text-sm">
          Only the cell whose signal was changed re-renders. The parent
          component and the other 2499 cells are not affected. Notice that this
          container <strong>does not flash</strong> on update.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          onClick={handleUpdate}
        >
          Update Random Cell (Signals)
        </button>
      </div>
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {gridSignals.map((signal, i) => (
          <GenericCell
            key={i}
            isUpdated={i === lastUpdated}
          >
            <S>{signal}</S>
          </GenericCell>
        ))}
      </div>
    </div>
  );
};

// --- useState Approach ---
const StateBenchmark = ({ setPerfData }: { setPerfData: Function }) => {
  const [gridState, setGridState] = useState(() => Array(CELL_COUNT).fill(0));
  const [lastUpdated, setLastUpdated] = useState(-1);
  const [isFlashing, setIsFlashing] = useState(false);
  const startTimeRef = useRef(0);

  const handleUpdate = () => {
    const randomIndex = Math.floor(Math.random() * CELL_COUNT);
    setLastUpdated(randomIndex);
    setTimeout(() => setLastUpdated(-1), 1000); // Clear the highlight

    setIsFlashing(true);
    startTimeRef.current = performance.now();

    setGridState((currentState) => {
      const newState = [...currentState];
      newState[randomIndex] += 1;
      return newState;
    });
  };

  // This useEffect ensures the time is measured AFTER the render is complete
  useEffect(() => {
    if (startTimeRef.current > 0) {
      const endTime = performance.now();
      setPerfData("state", endTime - startTimeRef.current);
      startTimeRef.current = 0; // Reset for the next measurement
    }

    if (isFlashing) {
      const timeoutId = setTimeout(() => setIsFlashing(false), 300);
      return () => clearTimeout(timeoutId);
    }
  }, [gridState, isFlashing, setPerfData]);

  console.log("Rendering PARENT: StateBenchmark (on every update!)");

  return (
    <div
      className={`benchmark-container transition-all duration-300 ${isFlashing ? "flash-border" : ""}`}
    >
      <div className="explanation">
        <h3 className="font-bold text-lg mb-2">How It Works (useState)</h3>
        <p className="text-sm">
          When updating the state, a new array is created, forcing React to
          re-render the parent component and <strong>all 2500</strong> cells.
          Notice this container <strong>flashes red</strong> on every click.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          onClick={handleUpdate}
        >
          Update Random Cell (useState)
        </button>
      </div>
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {gridState.map((value, i) => (
          <GenericCell
            key={i}
            isUpdated={i === lastUpdated}
          >
            {value}
          </GenericCell>
        ))}
      </div>
    </div>
  );
};

// --- Main Component ---
export function PerformanceBenchmark() {
  const [stats, setStats] = useState({
    state: { times: [] as number[], avg: 0, last: 0 },
    signal: { times: [] as number[], avg: 0, last: 0 },
  });
  const [activeTest, setActiveTest] = useState<"signal" | "state">("signal");

  const updatePerfData = (type: "signal" | "state", time: number) => {
    setStats((currentStats) => {
      const newTimes = [...currentStats[type].times, time];
      const newAvg = newTimes.reduce((a, b) => a + b, 0) / newTimes.length;
      return {
        ...currentStats,
        [type]: {
          times: newTimes,
          avg: newAvg,
          last: time,
        },
      };
    });
  };

  const handleReset = () => {
    setStats({
      state: { times: [], avg: 0, last: 0 },
      signal: { times: [], avg: 0, last: 0 },
    });
  };

  const chartData = [
    {
      name: "Average Time (ms)",
      useState: stats.state.avg,
      signal: stats.signal.avg,
    },
    {
      name: "Last Update (ms)",
      useState: stats.state.last,
      signal: stats.signal.last,
    },
  ];

  const statData = activeTest === "state" ? stats.state : stats.signal;

  return (
    <div className="font-sans p-4 md:p-8 w-full bg-slate-50 min-h-screen">
      <style>{`
        .flash-border { border-color: #ef4444; }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Benchmark: Signals vs. useState
          </h1>
          <button
            onClick={handleReset}
            className="mt-2 md:mt-0 px-4 py-2 bg-slate-600 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors"
          >
            Reset Statistics
          </button>
        </div>
        <p className="text-slate-600 mb-8">
          Both tests render a {GRID_SIZE}x{GRID_SIZE} ({CELL_COUNT}) cell grid.
          Click the button to update the value of <strong>one</strong> random
          cell and see the difference.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <div className="stats-card bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center">
            <h4 className="text-slate-500 font-semibold">Updates</h4>
            <p className="text-4xl font-bold text-slate-800 mt-1">
              {statData.times.length}
            </p>
          </div>
          <div className="stats-card bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center">
            <h4 className="text-slate-500 font-semibold">Last Time</h4>
            <p className="text-4xl font-bold text-slate-800 mt-1">
              {statData.last.toFixed(3)} ms
            </p>
          </div>
          <div className="stats-card bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center">
            <h4 className="text-slate-500 font-semibold">Average Time</h4>
            <p className="text-4xl font-bold text-slate-800 mt-1">
              {statData.avg.toFixed(3)} ms
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 h-64">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                domain={[0, "dataMax + 1"]}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(4)} ms`}
                cursor={{ fill: "rgba(239, 246, 255, 0.5)" }}
              />
              <Legend />
              <Bar
                dataKey="useState"
                fill="#f97316"
                name="useState (ms)"
              />
              <Bar
                dataKey="signal"
                fill="#16a34a"
                name="Signals (ms)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border-b border-slate-200 mt-8">
          <nav
            className="-mb-px flex space-x-6"
            aria-label="Tabs"
          >
            <button
              onClick={() => setActiveTest("signal")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTest === "signal" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
            >
              Signals Test
            </button>
            <button
              onClick={() => setActiveTest("state")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTest === "state" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
            >
              useState Test
            </button>
          </nav>
        </div>

        <div className="bg-white p-4 rounded-b-lg shadow-sm border border-t-0 border-slate-200">
          {activeTest === "signal" && (
            <SignalBenchmark setPerfData={updatePerfData} />
          )}
          {activeTest === "state" && (
            <StateBenchmark setPerfData={updatePerfData} />
          )}
        </div>
      </div>
    </div>
  );
}
