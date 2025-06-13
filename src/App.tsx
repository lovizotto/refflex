import AsyncPanel from './AsyncPanel.tsx';
import { Rf } from './Rf.tsx';
import { createSignal } from './core/createSignal.ts';


function App() {
  const [windowSize, setWindowSize] = createSignal({ width: 0, height: 0 });
  const [windowSize2, setWindowSize2] = createSignal({ width: 0, height: 0 });

  return <>
    {/*<AsyncPanel />*/}

    <Rf.OnResize on={({ width, height }) => {
      setWindowSize({ width, height });
    }} />


    <Rf.Signal value={windowSize}>
      {
        (size) => <div className="window-size">
          <h2>Window Size</h2>
          <p>Width: {size.width}px</p>
          <p>Height: {size.height}px</p>
        </div>
      }
    </Rf.Signal>

    <Rf.Signal value={windowSize2}>
      {
        (size) => <div className="window-size">
          <h2>Window Size 2</h2>
          <p>Width: {size.width}px</p>
          <p>Height: {size.height}px</p>
        </div>
      }
    </Rf.Signal>

  </>;
}

export default App;
