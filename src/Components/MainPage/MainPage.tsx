import React from 'react';
import styles from './MainPage.module.scss'
import ListCard from './ListCard/ListCard.tsx';
import { Link, Links } from 'react-router-dom';
import Loader from '../Loader/Loader.tsx';

type cardListType = {
  id: string,
  title: string,
  file: string
}

interface IMainPage {
  loading: boolean;
  cardListFilter: cardListType[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const MainPage:React.FC<IMainPage> = ({favorites, toggleFavorite, cardListFilter, loading, setLoading}) => {

  return (
    <div className={styles.mainPage}>

      <Link title='Создать новый продукт' className={styles.mainPageLink} to="/create-product">Создать продукт</Link>

      <section className={styles.cardLists}>
        {
          loading ? <Loader /> : <>
            {
              cardListFilter.length ? <>
            {
              (cardListFilter || []).map((obj, i) => {
                return <ListCard
                  key={i}
                  cardId={obj.id}
                  setLoading={setLoading}
                  cardImage={obj.file}
                  cardTitle={obj.title}
                  isFavorite={favorites.includes(obj.id)}
                  toggleFavorite={toggleFavorite}
                />
              })
            }</> : <h2>Нет карточек</h2>
          }
          </>
        }
      </section>
    </div>
  );
};

export default MainPage;