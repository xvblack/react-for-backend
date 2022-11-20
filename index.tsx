import { Noop, run, useContext, useEffect, useState } from "./react.tsx";
import React from "./react.tsx";

const ApiContext = React.createContext("ApiContext");

const API = ({
  path,
  callback,
}: {
  path: string;
  callback: (req: any) => void;
}) => {
  const apis = useContext<Map<String, any>>(ApiContext);
  useEffect(() => {
    apis.set(path, callback);
    return () => {
      apis.delete(path);
    };
  });
  return <Noop></Noop>;
};

// const File = ({ path }: { path: string }) => {
//   useEffect(() => {
//     const callback = async () => {
//       const watcher = Deno.watchFs(path);
//       for await (const event of watcher) {
//         console.log(">>>> event", event);
//         // Example event: { kind: "create", paths: [ "/home/alice/deno/foo.txt" ] }
//       }
//     };
//     callback();
//   });
//   return <Noop></Noop>;
// };

const apis = new Map<string, any>();

const Root = () => {
  return (
    <ApiContext.Provider value={apis}>
      <Component></Component>
    </ApiContext.Provider>
  );
};

const Component = () => {
  const [state, setState] = useState(0);
  console.log({ state });
  return (
    <API
      path={"root"}
      callback={() => {
        setState(state + 1);
      }}
    ></API>
  );
};

const server = run(<Root></Root>);
console.log(apis);
apis.get("root")();
// console.log({ allApis: stack.globals.allApis });
// stack.globals.allApis.get("root")();
