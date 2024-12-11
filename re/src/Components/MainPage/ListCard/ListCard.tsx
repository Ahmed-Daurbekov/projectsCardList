import React from 'react';
import empty from '../../../assets/img/empty.jpg'
import styles from "./ListCard.module.scss";
import { deleteCardById, fetchCardLists } from '../../../store/firebase/firebaseSlice.ts';
import { useAppDispatch } from '../../../hooks/hooks.ts';
import { Link, useNavigate } from 'react-router-dom';

interface IListCard {
  cardId: string;
  cardImage: string;
  cardTitle: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
}

const ListCard: React.FC<IListCard> = ({ cardId, cardImage, cardTitle, toggleFavorite, isFavorite, setLoading }) => {
  const dispatch = useAppDispatch()
  let navigate = useNavigate();
  
  function deleteCard(): void {
    if (window.confirm('Вы уверены')) {
      setLoading(true)
      dispatch(deleteCardById(cardId))
        .then(() => {
          dispatch(fetchCardLists())
          .then(() => {
            setLoading(false)
          })
        })
    }
  }

  return (
    <div className={styles.listCardWrapper}>
      <div className={styles.listCardOptions}>
        <svg onClick={() => navigate(`/edit-product/${cardId}`)} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.96006 3.56001L12.52 1L17 5.48001L14.44 8.03998M9.96006 3.56001L1.26509 12.2549C1.09536 12.4246 1 12.6549 1 12.8949V17H5.1051C5.34515 17 5.57536 16.9047 5.7451 16.7349L14.44 8.03998M9.96006 3.56001L14.44 8.03998" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <svg style={{cursor: 'pointer'}} onClick={() => toggleFavorite(cardId)} width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill={isFavorite ? 'red' : '#fff'} d="M17 5.88519C17 7.17392 16.525 8.41175 15.6766 9.32742C13.7239 11.4358 11.8299 13.6344 9.80424 15.6664C9.33992 16.1254 8.60336 16.1087 8.15904 15.6289L2.32301 9.32742C0.558998 7.42267 0.558998 4.34769 2.32301 2.44298C4.10435 0.519541 7.00635 0.519541 8.78768 2.44298L8.99984 2.67202L9.21184 2.44311C10.0659 1.52042 11.2291 1 12.4442 1C13.6594 1 14.8225 1.52037 15.6766 2.44298C16.525 3.35871 17 4.59648 17 5.88519Z" stroke="#FF0000" strokeWidth="1.24996" strokeLinejoin="round"/>
        </svg>

        <svg style={{cursor: 'pointer'}} onClick={deleteCard} width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 13.25L8.00002 7.12502M8.00002 7.12502L15 1M8.00002 7.12502L1 1M8.00002 7.12502L15 13.25" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <Link to={`/show-product/${cardId}`} className={styles.listCard}>
        <div className={styles.listCardImage}>
          <img src={cardImage || empty} alt="Фото продукта" />
        </div>
        
        <p className={styles.listCardText}>
          {cardTitle.length >= 30 ? cardTitle.slice(0, 30) + '...' : cardTitle}
        </p>
      </Link>
    </div>
  );
};


export default ListCard;