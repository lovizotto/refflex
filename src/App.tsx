import { Rf } from './core/Rf.tsx';
import { createSignal } from './core/createSignal.ts';

const [windowSize, setWindowSize] = createSignal({ width: 0, height: 0 });
const [, setWindowSize2] = createSignal({ width: 0, height: 0 });
const [users, ] = createSignal([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
]);

function App() {
  return (
    <>
      {/*<AsyncPanel />*/}
      <Rf.OnMount
        do={() =>
          setWindowSize2({
            width: window.innerWidth,
            height: window.innerHeight,
          })
        }
      />
      <Rf.OnResize
        on={({ width, height }) => {
          setWindowSize({ width, height });
        }}
      />

      <Rf.Signal value={windowSize}>
        {(size) => (
          <div className="window-size">
            <h2>Window Size</h2>
            <p>Width: {size.width}px</p>
            <p>Height: {size.height}px</p>
          </div>
        )}
      </Rf.Signal>

      <Rf.Loop each={users} keyExtractor={(user) => user.id}>
        {(user) => (
          <div className="item">
            <h3>
              {user.id} - {user.name}
            </h3>
          </div>
        )}
      </Rf.Loop>
    </>
  );
}

export default App;
