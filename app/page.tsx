'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [memes, setMemes] = useState<{ id: number; url: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch("https://api.imgflip.com/get_memes");
        const data = await response.json();
        setMemes(data.data.memes);
      } catch (error) {
        console.error('Error fetching memes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  if (loading) {
    return <p>Loading memes...</p>;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {memes.map((item) => (
        <div key={item.id} style={{ margin: '10px' }}>
          <Image
            alt="Meme"
            className="object-contain object-center"
            src={item.url}
            width={200} // Adjust the width as needed
            height={200} // Adjust the height as needed
          />
          <Link href={`/${item.id}`}>
            <button className="flex mx-auto mt-6 text-white bg-indigo-500 border-0 py-2 px-5 focus:outline-none hover:bg-indigo-600 rounded">Make Meme</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default App;
