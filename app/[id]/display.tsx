"use client";
import Image from 'next/image';
import React, { useState } from 'react';

interface SingleProduct {
    id: string;
    name: string;
    box_count: number;
    url: string;
}

interface ShowProps {
    singleProduct: SingleProduct;
}

const Show: React.FC<ShowProps> = ({ singleProduct }) => {
    const [downloadDisabled, setDownloadDisabled] = useState(true);
    const [updateMeme, setUpdateMeme] = useState<string>("");
    const [boxText, setBoxText] = useState<{ [key: string]: string }>({});

    const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBoxText(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleGenerateMeme = async () => {
        const filledBoxes = Object.values(boxText).filter(text => text.trim() !== '');
        if (filledBoxes.length !== singleProduct.box_count) {
            alert('Please fill all input boxes.');
            return;
        }

        const boxesParams = filledBoxes.map((text, index) => `boxes[${index}][text]=${encodeURIComponent(text)}`).join('&');
        const postAPI = `https://api.imgflip.com/caption_image?template_id=${singleProduct.id}&username=DaniyalNazeer&password=Daniyal12345&${boxesParams}`;

        try {
            const res = await fetch(postAPI);
            const result = await res.json();

            if (result.success) {
                setUpdateMeme(result.data.url);
                setBoxText({});
                setDownloadDisabled(false);
            } else {
                alert('Error generating meme: ' + result.error_message);
            }
        } catch (error) {
            alert('Error generating meme: ' + (error as Error).message);
        }
    };

    const handleDownloadMeme = async () => {
        if (updateMeme) {
            try {
                const response = await fetch(updateMeme);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'meme.jpg');

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                setDownloadDisabled(true);
            } catch (error) {
                alert('Error downloading meme: ' + (error as Error).message);
                setDownloadDisabled(true);
            }
        }
    };

    const reset = () => {
        setUpdateMeme("");
        setBoxText({});
        setDownloadDisabled(true);
    };

    return (
        <>
            <div>
                <h1 className='text-center my-11 text-4xl'>Meme Maker</h1>

                <section className="text-gray-600 body-font">
                    <div className="container mx-auto">
                        <div className="flex flex-wrap text-center lg:w-2/3 m-auto">

                            <div className="m-auto lg:w-1/2 bg-current sm:w-1/2 mb-10 px-4">
                                <div className="h-80 overflow-hidden">
                                    <Image 
                                        alt="content" 
                                        className="object-contain object-center h-full w-full" 
                                        src={updateMeme ? updateMeme : singleProduct.url} 
                                        width={180}
                                        height={37} 
                                    />
                                </div>
                            </div>

                            <div className="lg:w-1/2 bg-slate-200 sm:w-1/2 m-auto px-4">
                                <h2 className="title-font text-2xl font-medium text-gray-900 mt-6 mb-3">{singleProduct.name}</h2>

                                {[...Array(singleProduct.box_count)].map((_, index) => (
                                    <input
                                        required
                                        key={index}
                                        type="text"
                                        name={`text_${index}`}
                                        placeholder={`Enter Text Box ${index + 1}`}
                                        className='p-2 rounded'
                                        value={boxText[`text_${index}`] || ''}
                                        onChange={handleText}
                                        style={{ display: "block", margin: "auto", marginBottom: "10px" }}
                                    />
                                ))}
                                <button
                                    className="flex mx-auto my-8 text-white bg-indigo-500 border-0 py-2 px-5 focus:outline-none hover:bg-indigo-600 rounded"
                                    onClick={handleGenerateMeme}
                                >
                                    Generate Meme
                                </button>

                                {updateMeme && (
                                    <div className='flex justify-center align-center my-8'>
                                        <button 
                                            type="button" 
                                            className="w-1/2 flex justify-center py-3 items-center text-white bg-blue-300 rounded focus:outline-none"
                                            disabled={downloadDisabled}
                                            onClick={handleDownloadMeme}
                                            style={{ backgroundColor: downloadDisabled ? "pink" : "blue" }}
                                        >
                                            Download
                                        </button>
                                        <button
                                            type="button"
                                            onClick={reset}
                                            className="w-1/2 flex justify-center py-3 items-center text-white bg-red-700 rounded focus:outline-none mx-4"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Show;
