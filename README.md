# React-like Threading Library on deno

This repo reproduces React JSX in deno backend environment.

## Why Building This?

If you are familiar with React internals, you shall be aware of terminologies
like Fiber, Suspense. These words seems not to belong to a UI library, but
are more commonly found in threading libraries.

Why? Cause React JSX IS a **threading** library. When you construct a JSX
tree, as follow, it do creates a tree of "threads", or so called Fiber,
to execute it. Or more exactly, to power the **user input - dom refresh**
event loop. JSX is **syntactic sugar** for easier construction of this
structure.

```jsx
const Tree = () => {
    return (<div>
        <ComponentA>
            <ComponentNested></ComponentNested>
        </ComponentA>
        <ComponentB></ComponentB>
    </div>);
}
```

```
Root
|- thread ComponentA
    |- function call ComponentNested
|- thread ComponentB
```

So if JSX is a threading syntactic sugar, can we apply it to other scenarios outside
UI event loop? To answer this question, we shall first enumerate features of
this syntax.

- Build tree structured concurrent fibers easily via "dom tree" syntax.
- Control fiber lifecycle tightly via the builtin tree structure and 
  lifecycle hooks.
- Construct reactive dataflow (aka signals in Elm) to solve state
  management issues easily via data hooks like useState, useRecoilState.

My personal guess is these features can benefit database building, as

- Database application is the **most stateful** piece of softwares nowadays,
  extensively maintaining states like indicies, reactive materialized views,
  binlogs, etc.
- Database has to be scalable, within which organizing the IO events is
  one of the most complex piece.

Apart from database, incremental build system is another natural fit. In
fact, the rust Language Server Protocol implementaion rust-analyzer 
is built over salsa, an incremental computation library with 
great similarities to react state management libraries like Recoil.

So here we would like to try building these data-intensive,
stateful softwares with react style threading. The planned steps are:

- [x] Implement a lightweight react for backend environment, currently
  chose to be deno.
- [] Build a incremental analyzer of js projects, demonstrating the
  powerfulness of react-style threading with a reactive web UI.
- [] Experiment with hardcore database building with the "lightweight
  for-backend react", for better understanding its usefulness.
