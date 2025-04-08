import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { FileSearchAction, createFileSearchSlice } from './action';
import { SearchStoreState, initialState } from './initialState';

//  ===============  聚合 createStoreFn ============ //

export type SearchStore = SearchStoreState & FileSearchAction;

const createStore: StateCreator<SearchStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...createFileSearchSlice(...parameters),
});

//  ===============  实装 useStore ============ //
const devtools = createDevtools('file');

export const useFileSearchStore = createWithEqualityFn<SearchStore>()(
  devtools(createStore),
  shallow,
);

export const getFileSearchStoreState = () => useFileSearchStore.getState();
