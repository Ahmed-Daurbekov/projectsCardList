import React from 'react';
import styles from './Header.module.scss'
import { useLocation, useNavigate } from 'react-router-dom';

interface cardListType {
  id: string,
  title: string,
  file: string,
  isFavorite: boolean
}

interface IMainPage {
  loading: boolean,
  cardListFilter: cardListType[],
  setCardListFilter: React.Dispatch<React.SetStateAction<cardListType[]>>;
}

const Header: React.FC<IMainPage> = ({ cardListFilter, setCardListFilter, loading }) => {
  const [showFavorite, setShowFavorite] = React.useState<boolean>(false);
  const [filterQuery, setFilterQuery] = React.useState<string>('');
  let location = useLocation();
  let pathname = location?.pathname;
  let navigation = useNavigate();

  console.log(pathname);
  
  
  let titleObj: Record<string, string> = {
    'projectsCardList/': 'Продукты',
    'create-product': 'Создание нового продукта',
    'show-product/:id': 'Просмотр продукта',
    'edit-product/:id': 'Редактирование продукта',
  };

  const headerTitle = (() => {
    if (!pathname) return 'Продукты';
    
    const exactMatch = titleObj[pathname.slice(1)];
    if (exactMatch) return exactMatch;
    
    const dynamicRoute = Object.keys(titleObj).find((key) => {
      const dynamicRegex = new RegExp('^show-product/.+$');
      return dynamicRegex.test(pathname.slice(1));
    });

    const dynamicRouteEditProduct = Object.keys(titleObj).find((key) => {
      const dynamicRegex = new RegExp('^edit-product/.+$');
      return dynamicRegex.test(pathname.slice(1));
    });

    if (dynamicRoute) return dynamicRoute ? titleObj['show-product/:id'] : 'Продукты';
    
    if (dynamicRouteEditProduct) return dynamicRouteEditProduct ? titleObj['edit-product/:id'] : 'Продукты';
    
  })();

  const filteredItems = React.useMemo(() => {
    let result = cardListFilter;

    if (filterQuery) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(filterQuery.toLowerCase())
      );
    }

    if (showFavorite) {
      result = result.filter((item) => item.isFavorite);
    }

    return result;
  }, [filterQuery, showFavorite, cardListFilter]);

  React.useEffect(() => {
    setCardListFilter(filteredItems);
  }, [filteredItems, setCardListFilter]);

  const handleFavoriteToggle = () => {
    setShowFavorite((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <p className={styles.header_title}>
        {pathname !== '/' && (
          <svg
            style={{ cursor: 'pointer', marginRight: '10px' }}
            onClick={() => navigation(-1)}
            width="24"
            height="23"
            viewBox="0 0 24 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 11.6H2M2 11.6L11.6 2M2 11.6L11.6 21.2"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {headerTitle}
      </p>

      {headerTitle === 'Продукты' && (
        <>
          <div className={styles.filter_search}>
            <input
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Поиск карточки"
              type="text"
              className={styles.filter_searchInput}
            />
          </div>

          <div className={styles.filter_favorite}>
            <p className={styles.filter_favoriteText}>Только избранные</p>
            <label className={styles.filter_favoriteLabel}>
              <input
                type="checkbox"
                onChange={handleFavoriteToggle}
                checked={showFavorite}
                className={styles.filter_favoriteLabelCheckbox}
              />
              <span className={styles.filter_favoriteLabelSwitch}></span>
            </label>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;