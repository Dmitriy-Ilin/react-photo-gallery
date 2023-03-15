import './App.css';
import { useEffect, useState } from 'react';
import { getImages, searchImages } from './api';

function App() {
  const [imageList, setImageList] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [searchValue, setSearchValue] = useState('')
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await getImages();
      setImageList(response.resources);
      setNextCursor(response.next_cursor)
    }

    fetchData();
  }, []);

  const handleButtonClick = async () => {
    const response = await getImages(nextCursor);
    setImageList((currentImageList) => [...currentImageList, ...response.resources]);
    setNextCursor(response.next_cursor);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await searchImages(searchValue, nextCursor);
    setImageList(response.resources);
    setNextCursor(response.next_cursor);
  }

  const resetForm = async () => {
    const response = await getImages();
    setImageList(response.resources);
    setNextCursor(response.nextCursor);
    setSearchValue('');
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input 
        value={searchValue} 
        onChange={(e) => setSearchValue(e.target.value)}
        required='required' 
        placeholder='Введите поисковый запрос'></input>
        <button type='submit'>Поиск</button>
        <button onClick={resetForm} type='button'>Очистить</button>
      </form>
      <div className="image-grid">
        {imageList.map((image) => (<img src={image.url} alt={image.public_id} key={image.asset_id}></img>))}
      </div>
      <div className='footer'>
        {nextCursor && <button onClick={handleButtonClick}>Загрузить ещё</button>}
      </div>
    </>
    
  );
}

export default App;
