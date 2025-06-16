import React from 'react';
import { PerformanceBenchmark } from '../../components/Benchmark';
import ExampleCard from './ExampleCard';
import SignalExample from './SignalExample';
import ShowExample from './ShowExample';
import ActionExample from './ActionExample';
import MemoExample from './MemoExample';
import LoopExample from './LoopExample';
import BindInputExample from './BindInputExample';
import TimerExample from './TimerExample';
import InteractiveShowcase from './InteractiveShowcase';

const ExamplesPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Modern Signal Components Examples
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ExampleCard title="Signal & S Component">
          <SignalExample />
        </ExampleCard>
        <ExampleCard title="Show (Conditional Rendering)">
          <ShowExample />
        </ExampleCard>
        <ExampleCard title="Action (Side Effect)">
          <ActionExample />
        </ExampleCard>
        <ExampleCard title="Computed Signal">
          <MemoExample />
        </ExampleCard>
        <ExampleCard title="Loop (Reactive List)">
          <LoopExample />
        </ExampleCard>
        <ExampleCard title="BindInput (Two-way Binding)">
          <BindInputExample />
        </ExampleCard>
        <ExampleCard title="Performance Benchmark">
          <PerformanceBenchmark />
        </ExampleCard>
        <ExampleCard title="Timer Component">
          <TimerExample />
        </ExampleCard>
        <ExampleCard title="Interactive Showcase (VirtualList)">
          <InteractiveShowcase />
        </ExampleCard>
      </div>
    </div>
  );
};

export default ExamplesPage;