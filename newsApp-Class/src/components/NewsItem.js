import React, { Component } from 'react'

export class NewsItem extends Component {

    render() {
        let { title, description, imageUrl, newsUrl, author, date, source } = this.props   //destructring of the object
        return (
            <div className='my-3'>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', right: '0' }}>
                        <span className="badge rounded-pill bg-danger">{source}</span>
                    </div>
                    <img src={!imageUrl ? "https://www.tbstat.com/wp/uploads/2023/03/20230317_Gemini_Color-1200x675.jpg" : imageUrl} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">{title} </h5>
                        <p className="card-text">{description}</p>
                        <p className='card-text'><small className='text-muted'>By {author} on {new Date(date).toGMTString()}</small></p>
                        <a href={newsUrl} rel="noreferrer" target="_blank" className='btn btn-sm btn-dark'>Read More</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewsItem



