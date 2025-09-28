import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {

    static defaultProps = {
        country: 'us',
        pageSize: 8,
        category: 'general',
    }

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }

    capitalize = (word) => {
        let w = word.toLowerCase()
        return w.charAt(0).toUpperCase() + w.slice(1)
    }

    constructor(props) {    //need to pass props to use props in constructor
        super(props);
        this.state = {
            articles: [],
            loading: true,
            page: 1,
            totalResults: 0
        }
        document.title = `${this.capitalize(this.props.category)} - NewsMonkey`
    }

    async updateNews() {
        this.props.setProgress(10)
        // url to fetch the news
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`
        this.setState({ loading: true })
        // the async function will wait for the promise to resolve
        let data = await fetch(url)
        this.props.setProgress(30)
        let parsedData = await data.json()
        this.props.setProgress(70)
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false

        })
        this.props.setProgress(100)
    }

    async componentDidMount() {
        this.updateNews()
    }

    // handleNextClick = async () => {
    //     this.setState({ page: this.state.page + 1 })
    //     this.updateNews()
    // }

    // handlePreviousClick = async () => {
    //     this.setState({
    //         page: this.state.page - 1
    //     })
    //     this.updateNews()
    // }
    // 07b1204349bb4b5ab45d132c4f1b5465
     fetchMoreData = async () => {
        this.setState({ page: this.state.page + 1 })
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`
        this.setState({ loading: true })
        // the async function will wait for the promise to resolve
        let data =  await fetch(url)
        let parsedData = await data.json()
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults,
            loading: false
        })
    }
    
    // bootstrap has 4x3 grid col-md-4 means it will take space of 4 columns 
    render() {
        return (
            <>
                <h1 className='text-center' style={{ margin: "35px" }}>NewsMonkey - Top {this.capitalize(this.props.category)} Headlines</h1>
               {this.state.loading && <Spinner/>}
                <InfiniteScroll               
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={this.state.loading && this.state.articles.length !== this.state.totalResults? <Spinner/>:null}>
                        <div className='container'>
                    <div className='row'>
                        {/*!this.state.loading &&*/}
                        {  
                        this.state.articles.map((element) => {
                            if (!element) return null; // skip undefined/null entries
                            return (<div className='col-md-4' key={element.url}>   {/*unique key to be returned*/}
                            {/* passing props to NewsItem */}
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author ? element.author : "Unknown"} date={element.publishedAt} source={element.source.name} /> {/*passing props to NewsItem component*/}
                            </div>)
                        })}
                    </div>
                    </div>
                </InfiniteScroll>
                {/* <div className='container d-flex justify-content-between'>
                    <button disabled={this.state.page <= 1} type='button' className='btn btn-dark' onClick={this.handlePreviousClick}>&larr; Previous</button>
                    <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type='button' className='btn btn-dark' onClick={this.handleNextClick}>Next &rarr;</button>
                </div> */}
           
            </>
        )
    }
}

export default News

