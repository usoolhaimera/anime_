import React from 'react';
import axios from "axios";
import { useState, useEffect } from "react";
import AllAnime from "../components/AllAnime";
import { useParams } from 'react-router-dom';




function AnimeSearch() {
    const [anime, setAnime] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const { searchQuery } = useParams();
    const [query, setQuery] = useState(searchQuery || "");




    const getData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_URL}/meta/anilist/advanced-search`, { params: { query: query, sort: ["POPULARITY_DESC", "SCORE_DESC"], page: page } });

            if (page > 1) {
                setAnime((prev) => [...prev, ...res.data.results])
                setHasNext(res.data.hasNextPage);
            } else {
                setAnime(res.data.results);
                setHasNext(res.data.hasNextPage);
            }
            setLoading(false);


        } catch (error) {
            console.error("Error finding the anime query", error);
            setLoading(false);
        } finally {
            setLoading(true);
        }
    }


    useEffect(() => {
        getData();
    }, [page, query]);

    const handlechange = (e) => {
        setQuery(e.target.value);
        setPage(1);
    }

    useEffect(() => {
        const handleScroll = (ev) => {
            // console.log("scrolling");
            if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 10 && hasNext) {
                setPage((prev) => prev + 1);
            }

        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [page, hasNext]);


    return (

        <div>
            {/* <div className="font-medium text-blue-700 justify-center  text-xl "> */}

            <div className=" border-spacing-2 mx-5 my-7 justify-center text-center font-medium text-xl outline-none  text-blue-50">
                <h1 className='my-3'>Search Box</h1>
                <input type="text" placeholder="Search Anime" value={query} onChange={(e) => handlechange(e)} className='bg-gray-950 rounded-xl h-10 w-1/2 md:w-2/5 mx-auto text-gray-300' />
            </div>
            {loading ? (
                <>
                    <div className="grid auto-rows-max grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 mx-auto w-11/12 justify-center">
                        {anime && anime.map((i) =>
                            <AllAnime key={i.id} anime={i} />
                        )
                        }
                    </div>
                    <div className="font-medium text-blue-50 justify-center  text-xl text-center">
                        {!hasNext && <span>END OF THE PAGE</span>}
                    </div>
                </>
            ) : (
                null
            )}



        </div>
    )
}
export default AnimeSearch;