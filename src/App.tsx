import { useAppDispatch, useAppSelector } from './hooks/hooks.ts';
import { Routes, Route } from "react-router-dom";
import MainPage from './Components/MainPage/MainPage.tsx';
import CreateCard from './Components/CreateCard/CreateCard.tsx';
import Header from './Components/Header/Header.tsx';
import CardShow from './Components/CardShow/CardShow.tsx';
import { useSelector } from 'react-redux';
import React from 'react';
import { fetchCardLists, updateCardById } from './store/firebase/firebaseSlice.ts';
import EditCard from './Components/EditCard/EditCard.tsx';

type cardListType = {
  id: string,
  title: string,
  file: string
  isFavorite: boolean;
}

interface RootState {
  firebase: {
    lists: Record<string, cardListType>;
  };
}

function App() {
  const [cardListFilter, setCardListFilter] = React.useState<cardListType[]>([]);
  const [cardListWithFilterArr, setCardListWithFilterArr] = React.useState<cardListType[]>([]);
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const cardList = useSelector((store: RootState) => store.firebase.lists);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [upDate, setUpDate] = React.useState<boolean>(false)
  let dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchCardLists()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  function setLists( ) {
    if (cardList) {
      const arr: cardListType[] = Object.entries(cardList).map(([id, item]) => ({
        ...item,
        id,
        isFavorite: favorites.includes(id),
      }));
      setCardListFilter(arr);
      setCardListWithFilterArr(arr);
    }
  }
  
  React.useEffect(() => {
    setLoading(true)
    dispatch(fetchCardLists()).then(() => {
      setLoading(false);
    });
  }, [upDate])

  React.useEffect(() => {
    setLists()
  }, [cardList, favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
    
    let newObj = {
      file: cardListFilter.find(obj => obj.id === id)?.file,
      title: cardListFilter.find(obj => obj.id === id)?.title,
      isFavorite: !cardListFilter.find(obj => obj.id === id)?.isFavorite
    };

    dispatch(updateCardById({ id, data: newObj }));
  };

  return (
    <>
      <Header
        cardListFilter={cardListFilter}
        setCardListFilter={setCardListWithFilterArr}
        loading={loading}
      />
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              cardListFilter={cardListWithFilterArr}
              loading={loading}
              setLoading={setLoading}
              toggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          }
        />
        <Route path="/create-product" element={<CreateCard setUpDate={setUpDate} upDate={upDate} />} />
        <Route path="/edit-product/:id" element={<EditCard />} />
        <Route path="/show-product/:id" element={<CardShow />} />
      </Routes>
    </>
  );
}


export default App;