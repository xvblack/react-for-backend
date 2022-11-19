interface Element {
  type: string;
  renderer: Function;
  props: any;
  children: any[];
}

const createElement = (renderer: Function, props: any, ...children: any[]) => {
  return { type: renderer.name, renderer, props, children };
};

const Fragment = () => {
  return undefined;
};

const Noop = () => {
  return undefined;
};

let stack = {
  path: [] as string[],
  rerun: () => {},
  states: new Map<string, any>(),
  track: {
    useStateCount: 0,
  },
  globals: {
    allApis: new Map<string, any>(),
  },
};

const stackKey = (key: string) => {
  return [...stack.path, key].join(".");
};

const useState = (defaultValue: any) => {
  const states = stack.states;
  const useStateCount = stack.track.useStateCount;
  stack.track.useStateCount += 1;
  const key = stackKey(`__useState_${useStateCount}`);

  const rerun = stack.rerun;
  console.log("Using state", states, { key });
  if (!states.has(key)) {
    states.set(key, defaultValue);
  }
  return [
    states.get(key),
    (newValue: any) => {
      console.log("Setting new state to", newValue);
      states.set(key, newValue);
      // console.log("Rerunning stack", key);
      rerun();
    },
  ];
};

const API = ({
  path,
  callback,
}: {
  path: string;
  callback: (req: any) => void;
}) => {
  stack.globals.allApis.set(path, callback);
  return <Noop></Noop>;
};

const useEffect = (effect: any) => {
  const path = stack.track.useEffectInitHistory;
};

const File = ({ path }: { path: string }) => {
  useEffect(() => {
    const callback = async () => {
      const watcher = Deno.watchFs(path);
      for await (const event of watcher) {
        console.log(">>>> event", event);
        // Example event: { kind: "create", paths: [ "/home/alice/deno/foo.txt" ] }
      }
    };
    callback();
  });
  return <Noop></Noop>;
};

const Root = () => {
  const [state, setState] = useState(0);
  console.log({ state });
  return (
    <>
      <API
        path={"root"}
        callback={() => {
          setState(state + 1);
        }}
      ></API>
    </>
  );
};

const run = (element: Element) => {
  runReactiveServer([], element);
};

const runReactiveServer = (path: string[], element: Element) => {
  if (element.type === Noop.name) {
    return;
  } else if (element.type === Fragment.name) {
    for (const child of element.children) {
      runReactiveServer(path, child);
    }
  } else {
    const nestedPath = [...path, element.type];
    const tieTheKnot = {
      self: null as any,
    };
    const renderProc = () => {
      stack.path = nestedPath;
      stack.rerun = tieTheKnot.self;
      runReactiveServer(
        nestedPath,
        element.renderer(element.props, element.children)
      );
    };
    tieTheKnot.self = renderProc;
    renderProc();
  }
};

const server = run(<Root></Root>);
console.log({ allApis: stack.globals.allApis });
stack.globals.allApis.get("root")();
