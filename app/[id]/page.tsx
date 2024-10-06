import React from 'react';
import Display from './display';

interface Meme {
    id: number;
    name: string;
    url: string;
    box_count: number; // Add box_count to the Meme interface
    // Add any other properties you expect from the meme data
}

interface ApiResponse {
    data: {
        memes: Meme[];
    };
}

interface DetailsProps {
    params: {
        id: number; // or string if the ID is a string
    };
}

// Convert to arrow function
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
