// type Store state view = {view, state -> view}
// Store s v
// extend :: (Store s v -> u) -> Store s v -> Store s u
const Store = ({ state, render }) => ({
  // extend :: (w a -> b) -> w a -> w b
  extend: f => Store({ state, render: state => f(Store({ state, render })) }),
  // extract :: w a -> a
  extract: () => render(state),
  state,
  render
});

const App = Store({ state: "Pete", render: name => `Hello, ${name}!` });

App.extend(({ state }) => (state === "Pete" ? "SECRETS" : state)).extract(); //?

const updateState = (store, state) =>
  store
    .extend(x => x) // Store v (Store v s)
    .render(
      // render takes state
      state // This needs to be state
      // Store({ ...store, state }).extract() // preserve the render function
    );

updateState(App, "Foo")
  .extend(({ state }) => (state === "Pete" ? "SECRETS" : state))
  .extract(); //?

// type Moore event view = { view, event -> Moore event view }
// Moore e v
const Moore = ({ handle, view }) => ({
  // extend :: (Moore e v -> u) -> Moore e v -> Moore s u
  extend: (
    f // f :: Moore e v -> u
  ) =>
    Moore({
      // handle :: e -> Moore e u
      // handle: event => f(Moore({ handle, view })).handle(event), // This was wrong :(
      handle: event => handle(event).extend(f),
      view: f(Moore({ handle, view })).extract()
    }),
  // extract :: Moore e v -> v
  extract: () => view,
  // handle :: e -> Moore e v
  handle,
  // view :: v
  view
});
