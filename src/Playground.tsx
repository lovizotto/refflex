import { Rf } from './core/Rf.tsx';


function Playground() {
  const [count, setCount] = Rf.createSignal(0);
  const [name, setName] = Rf.createSignal('');

  return (
    <div>
      <Rf.Signal value={count}>
        {(value) => <h1>Contador: {value}</h1>}
      </Rf.Signal>
      <button onClick={() => setCount(count() + 1)}>Increment</button>

      <Rf.Cond condition={() => count() > 5}>
        <h2>O contador é maior que zero!</h2>
        <Rf.Timer delay={3000} do={() => alert('3 segundos!')} />
        <Rf.Otherwise>
          <h2>O contador é zero ou negativo.</h2>
        </Rf.Otherwise>
        <Rf.Cond condition={() => count() > 3}>
          <h2>O contador é maior que 3!</h2>
          <Rf.Timer delay={2000} do={() => alert('2 segundos!')} />
          <Rf.EndCond />
        </Rf.Cond>
        <Rf.EndCond />
      </Rf.Cond>
      <Rf.Async
        task={async () => {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const res = await fetch(
            'https://jsonplaceholder.typicode.com/posts/1',
          );
          return await res.json();
        }}
      >
        <Rf.Fulfilled>
          {(data) => (
            <div>
              <h2>Post:</h2>
              <p>
                <strong>Title:</strong> {data.title}
              </p>
              <p>
                <strong>Body:</strong> {data.body}
              </p>
            </div>
          )}
        </Rf.Fulfilled>
        <Rf.Pending>Carregando</Rf.Pending>
        <Rf.Rejected>
          {(error: Error | unknown) => ( // AQUI ESTÁ A CORREÇÃO: aceita Error | unknown
            <p style={{ color: 'red' }}>
              Erro:{" "}
              {error instanceof Error // Verifica se é uma instância de Error
                ? error.message
                : typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string'
                  ? (error as any).message // Se for um objeto com propriedade `message`
                  : String(error) // Fallback para outros tipos (string, number, etc.)
              }
            </p>
          )}
        </Rf.Rejected>
        <Rf.EndAsync />
      </Rf.Async>

      <Rf.OnMount do={() => console.log('Abacaxi!')} />
      <Rf.OnMount do={() => console.log('Mounted!')} />

      <Rf.OnMount do={() => console.log('Mounted!')} />
      <Rf.OnMount do={() => console.log('Mounted!')} />

      <Rf.Signal value={name}>
        {(_) => (
          <div>
            <input
              type="text"
              value={name()}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
            />
            <Rf.Run watch={() => name()}>
              {(val) => (
                <>
                  {' '}
                  <Rf.Cond condition={() => val.length === 0}>
                    Digite seu nome
                  </Rf.Cond>
                </>
              )}
            </Rf.Run>
          </div>
        )}
      </Rf.Signal>

      <Rf.Run watch={() => count()}>
        {(val) => <div>Vai imprimir o count {val}</div>}
      </Rf.Run>

      <Rf.Memo deps={[count()]} compute={() => count() * 10}>
        {(res) => <p>10x: {res}</p>}
      </Rf.Memo>

      <Rf.TransitionZone>
        <p>Transição declarativa completa</p>
      </Rf.TransitionZone>
    </div>
  );
}

export default Playground;
