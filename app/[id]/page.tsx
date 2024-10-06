import React from 'react';
import Display from './display';

interface Meme {
    id: string; // Change id to string
    name: string;
    url: string;
    box_count: number; // Ensure this matches your data structure
    // Add any other properties you expect from the meme data
}

interface ApiResponse {
    data: {
        memes: Meme[];
    };
}

interface DetailsProps {
    params: {
        id: string; // Change to string to match the Meme id
    };
}

const Details: React.FC<DetailsProps> = async (props) => {
    const res = await fetch("https://api.imgflip.com/get_memes");
    const result: ApiResponse = await res.json();

    const singleProduct = result.data.memes.find((data) => data.id === props.params.id);

    if (!singleProduct) {
        return <div>Meme not found</div>; // Handle the case where the meme is not found
    }

    return (
        <Display singleProduct={singleProduct} />
    );
};

export default Details;
