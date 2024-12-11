import React, { ChangeEvent } from 'react';
import styles from './CreateCard.module.scss'
import { SubmitHandler, useForm } from 'react-hook-form';

import firebase from 'firebase/app';
import 'firebase/storage';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../hooks/hooks';
import { fetchCardById } from '../../store/firebase/firebaseSlice';


interface FormValues {
  title: string;
  file: File | null
}

type createCardType = {
  setUpDate: React.Dispatch<React.SetStateAction<boolean>>;
  upDate: boolean
}

const CreateCard:React.FC<createCardType> = ({setUpDate, upDate}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [selectImg, setSelectImg] = React.useState<string | ArrayBuffer | null>(null)
  const [fileObject, setFileObject] = React.useState<File | null>(null)
  const [dataObj, setDataObj] = React.useState<FormValues>({
    title: '',
    file: null,
  })
  let navigate = useNavigate()
  let [loading, setLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyDO-e8ZFVEzA12XusFQq1FsnUs6yEB0eGc",
      authDomain: "dimpom-4d9fe.firebaseapp.com",
      projectId: "dimpom-4d9fe",
      storageBucket: "dimpom-4d9fe.appspot.com",
      messagingSenderId: "213650717391",
      appId: "1:213650717391:web:f90b88e48105a3d96b95ba",

      databaseURL: "https://dimpom-4d9fe-default-rtdb.firebaseio.com",
      measurementId: "G-C5GYKMLBBL"
    };
    
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }, []);
  
  function changeImage(e: React.ChangeEvent<HTMLInputElement>) {
    let file = e.target.files?.[0];
    if (file) {
      setFileObject(file)
      let reader = new FileReader()
      reader.readAsDataURL(file);

      reader.onload = function () {
        setSelectImg(reader.result)
      }
    } else {
      setFileObject(null)
      setSelectImg(null)
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {

    setLoading(true)
    if (Boolean(data.title.trim())) {
      if (fileObject) {
        
        const storage = firebase.storage();
        const storageRef = storage.ref();
        const imageRef = storageRef.child('images/' + fileObject.name);

        try {
          let data2 = await imageRef.put(fileObject);
          let imgPath = (data2 as any)._delegate.metadata.fullPath
          var imgstorage = firebase.storage();
          var imgstorageRef = imgstorage.ref();
          var fileRef = imgstorageRef.child(imgPath);
          fileRef.getDownloadURL()
          .then(function(url) {
            const newObj = {
              file: url,
              title: data.title,
            };

            axios.post(`https://dimpom-4d9fe-default-rtdb.firebaseio.com/testTask.json`, newObj);
          })
          setUpDate(!upDate)
          setLoading(false)
          navigate('/projectsCardList/')
        } catch (error) {
          console.error('Ошибка загрузки изображения: ', error);
        }
        
      }
    }
  };
  
  return (
    <div className={styles.createCard}>      
      <form className={styles.createCardForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles['createCardForm-img_block']}>
          {
            selectImg ? <>
              <label htmlFor="file">
                <img src={typeof selectImg === "string" ? selectImg : undefined}  alt="Выбраное изображение" />
                <input {...register('file', {
                  onChange: (e) => changeImage(e), 
                })} type='file' className={styles.inputFile} id='file' />
                {errors.file && <p>{errors.file.message}</p>}
              </label>
            </> : <>
              <label htmlFor='file'>
                <span className={styles['click-to-select']}>Нажмите чтобы выбрать фотографию</span>
                
                <input {...register('file', {
                  onChange: (e) => changeImage(e), 
                })} type='file' className={styles.inputFile} id='file' />
                {errors.file && <p>{errors.file.message}</p>}
              </label>
            </>
          }
        </div>
        <div>
          <label style={{display: 'block', fontSize: '18px', fontWeight: '500'}}>Описание</label>
          <textarea placeholder='Введите текст' className={styles.createCardFormTextArea} {...register('title', {
            required: 'Эта поле обязательный'
          })}></textarea>
          {errors.title && <p>{errors.title.message}</p>}

          <button disabled={loading} className={styles.createCardFormButton} type="submit">{loading ? 'Добавление...' : 'Добавить'}</button>
        </div>
        
      </form>
    </div>
  );
};

export default CreateCard;