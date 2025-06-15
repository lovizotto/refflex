import { Rf } from './core/Rf.tsx';

import { createSignal } from '../core/createSignal.ts';

const fetchTodos = async (url: string) => {
  return await fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => data);
};

const StatusEnum = {
  pendente: 'pendente',
  confirmado: 'confirmado',
  cancelado: 'cancelado',
};
const [name, setName] = createSignal('');

export default function AsyncPanel() {
  return (
    <div className="async-panel">
      <h2>Async Panel</h2>
      <p>This is a placeholder for the AsyncPanel component.</p>
      <Rf.Async
        task={() => fetchTodos('https://jsonplaceholder.typicode.com/todos/1')}
      >
        <Rf.Fulfilled>
          {(data) => (
            <div>
              <h3>Task Result:</h3>
              <p>{data.title}</p>
            </div>
          )}
        </Rf.Fulfilled>
        <Rf.Pending>
          <div>Loading...</div>
        </Rf.Pending>
        <Rf.Rejected>
          {(error) => (
            <div>
              <h3>Error:</h3>
              <p>{error.message}</p>
            </div>
          )}
        </Rf.Rejected>
      </Rf.Async>
      <Rf.Async
        task={() => fetchTodos('https://jsonplaceholder.typicode.com/posts')}
      >
        <Rf.Fulfilled<
          {
            id: number;
            title: string;
          }[]
        >>
          {(data) => (
            <Rf.Loop each={data}>
              {(
                item: {
                  id: number;
                  title: string;
                },
                i,
              ) => (
                <Rf.SlideIn duration={100 * i} key={item.id}>
                  <div key={item.id}>
                    <h3>Task Result:</h3>
                    <p>{item.title}</p>
                  </div>
                </Rf.SlideIn>
              )}
            </Rf.Loop>
          )}
        </Rf.Fulfilled>
        <Rf.Pending>
          <div>Loading...</div>
        </Rf.Pending>
        <Rf.Rejected>
          {(error) => (
            <div>
              <h3>Error:</h3>
              <p>{error.message}</p>
            </div>
          )}
        </Rf.Rejected>
      </Rf.Async>

      <Rf.Signal value={name}>
        {(value) => (
          <div>
            <h3>Signal Value:</h3>
            <p>{value}</p>
            <input
              type="text"
              value={name()}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type something..."
            />
            <Rf.StateGroup state={() => value}>
              <Rf.State name="pendente">
                <div>
                  <h3>Status: {StatusEnum.pendente}</h3>
                  <p>Task is pending.</p>
                </div>
              </Rf.State>
              <Rf.State name="confirmado">
                <div>
                  <h3>Status: {StatusEnum.confirmado}</h3>
                  <p>Task has been confirmed.</p>
                </div>
              </Rf.State>
              <Rf.State name="cancelado">
                <div>
                  <h3>Status: {StatusEnum.cancelado}</h3>
                  <p>Task has been canceled.</p>
                </div>
              </Rf.State>
            </Rf.StateGroup>
          </div>
        )}
      </Rf.Signal>

      <Rf.Cond condition={() => name().length === 0}>Nome invalido</Rf.Cond>

      {/*<Rf.Timer delay={3000} do={() => alert('3 segundo')} />*/}
      {/*<Rf.Timer delay={1000} do={() => alert('1 segundo')}/>*/}
      {/*<Rf.Timer delay={2000} do={() => alert('2 segundo')} />*/}
    </div>
  );
}
