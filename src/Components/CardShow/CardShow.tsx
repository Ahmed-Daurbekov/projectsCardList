import React from 'react';
import styles from './CardShow.module.scss'
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../hooks/hooks.ts';
import { fetchCardById } from '../../store/firebase/firebaseSlice.ts';
import { useParams } from 'react-router-dom';
import { type } from 'os';
import Loader from '../Loader/Loader.tsx';

type RouteParams = {
  id: string;
}

type CardInfoType = {
  title: string;
  file: string;
};

interface RootState {
  firebase: {
    cardInfo: CardInfoType;
  };
}

const CardShow = () => {
  const cardInfo = useSelector((store: RootState) => store.firebase.cardInfo)
  const [loading, setLoading] = React.useState<boolean>(true)
  let dispatch = useAppDispatch()
  let {id} = useParams<RouteParams>()

  React.useEffect(() => {
    if (id) {
      dispatch(fetchCardById(id))
        .then((dara) => {
          setLoading(false)
        })
    }
    
  }, [])
  
  return (
    <div className={styles.cardShow}>
      {
        loading ? <Loader/> : <>
          <div className={styles.cardShowBlock}>
            <div className={styles['cardShowBlock-img_block']}>
              <img src={cardInfo.file} alt="Фото продукта" />
            </div>
            <div className={styles['cardShowBlock-text_block']}>
              <p>
                {cardInfo.title}
              </p>
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default CardShow;