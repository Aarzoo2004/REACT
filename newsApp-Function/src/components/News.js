import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    // Capitalize function
    const capitalize = (word) => {
        let w = word.toLowerCase();
        return w.charAt(0).toUpperCase() + w.slice(1);
    }

    // Update news function
    const updateNews = async () => {
        props.setProgress(10);
        setLoading(true);
        try {
            let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
         
            let data = await fetch(url);
            props.setProgress(30);
            let parsedData = await data.json();
            props.setProgress(70);

            // Safe check for articles
            setArticles(parsedData.articles || []);
            setTotalResults(parsedData.totalResults || 0);
        } catch (error) {
            console.error("Error fetching news:", error);
            setArticles([]);
            setTotalResults(0);
        }
        setLoading(false);
        props.setProgress(100);
    }

    useEffect(() => {
        setPage(1); // reset page when category/country changes
        updateNews();
    }, [props.country, props.category, props.pageSize]);

    // Fetch more data function
    const fetchMoreData = async () => {
        const nextPage = page + 1;
        setPage(nextPage);
        try {
            let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`;
            let data = await fetch(url);
            let parsedData = await data.json();

            setArticles(prevArticles => [...prevArticles, ...(parsedData.articles || [])]);
            setTotalResults(parsedData.totalResults || 0);
        } catch (error) {
            console.error("Error fetching more news:", error);
        }
    }

    return (
        <>
            <h1 className='text-center' style={{ margin: "35px" }}>
                NewsMonkey - Top {capitalize(props.category)} Headlines
            </h1>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length < totalResults}
                loader={loading && articles.length !== totalResults ? <Spinner /> : null}
            >
                <div className='container'>
                    <div className='row'>
                        {articles.map((element) => (
                            <div className='col-md-4' key={element.url}>
                                <NewsItem
                                    title={element.title || ""}
                                    description={element.description || ""}
                                    imageUrl={element.urlToImage}
                                    newsUrl={element.url}
                                    author={element.author || "Unknown"}
                                    date={element.publishedAt}
                                    source={element.source?.name || "Unknown"}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    );
}

News.defaultProps = {
    country: 'us',
    pageSize: 8,
    category: 'general',
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    apiKey: PropTypes.string.isRequired,
    setProgress: PropTypes.func.isRequired
}

export default News;
