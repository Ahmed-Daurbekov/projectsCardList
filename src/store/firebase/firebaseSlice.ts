import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ICardLists {
  image: string,
  title: string,
}

interface ICardListsState {
  lists: {},
  cardInfo: {},
  loader: boolean | undefined
}

export const fetchCardLists = createAsyncThunk('cardList/fetchBuildingWithSystems', async () => {
  let url = `https://dimpom-4d9fe-default-rtdb.firebaseio.com/testTask.json`;
  const response = await axios.get(url) ;
  return response.data;
});

export const fetchCardById = createAsyncThunk('cardList/fetchCardById', async (id:string | undefined) => {
  let url = `https://dimpom-4d9fe-default-rtdb.firebaseio.com/testTask/${id}.json`;
  const response = await axios.get(url) ;
  return response.data;
});

export const updateCardById = createAsyncThunk('cardList/updateCardById',
  async ({ id, data }: { id: string; data: { isFavorite: boolean | undefined } }) => {
    const url = `https://dimpom-4d9fe-default-rtdb.firebaseio.com/testTask/${id}.json`;
    const response = await axios.put(url, data);
    return response.data;
  }
);

export const deleteCardById = createAsyncThunk('cardList/fetchCardById', async (id:string) => {
  let url = `https://dimpom-4d9fe-default-rtdb.firebaseio.com/testTask/${id}.json`;
  const response = await axios.delete(url);
  return response.data;
});

let initialState:ICardListsState = {
  lists: [],
  cardInfo: {},
  loader: true
}

const firebaseSlice = createSlice({
  name: 'iten',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardLists.pending, (state) => {
        state.loader = true
      })
      .addCase(
        fetchCardLists.fulfilled,
        (state, action: PayloadAction<ICardLists>) => {
          state.loader = false;
          state.lists = action.payload
        }
      )
      .addCase(fetchCardLists.rejected, (state, action) => {
        state.loader = true
      })

      // ======
      .addCase(fetchCardById.pending, (state) => {
        state.loader = true
      })
      .addCase(
        fetchCardById.fulfilled,
        (state, action: PayloadAction<ICardLists>) => {
          state.loader = false;
          state.cardInfo = action.payload
        }
      )
      .addCase(fetchCardById.rejected, (state, action) => {
        state.loader = true
      })
  },
})

export default firebaseSlice.reducer;
