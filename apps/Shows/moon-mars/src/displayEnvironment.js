// This is a very crude way of storing global state,
// and if the applicaiton grows we should consider putting this into
// a redux store, or similar, to make sure affected components rerender when state is changed.

let _isDome = false;

export default {
  isDome: () => {
    return _isDome;
  },

  setIsDome: (dome) => {
    _isDome = dome;
  }
};