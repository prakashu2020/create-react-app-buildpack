import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';  

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
/*
function isSearched(searchTerm) {
  return function(item) {
  // some condition which returns true or false
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}
*/
class App extends Component {
  constructor(props) {
      super(props);
      
      this.state = {
        result: null,
        searchTerm: DEFAULT_QUERY,
      };

      this.setSearchTopStories = this.setSearchTopStories.bind(this);
      this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
      this.onSearchChange = this.onSearchChange.bind(this);
      this.onSearchSubmit = this.onSearchSubmit.bind(this);
      this.onDismiss = this.onDismiss.bind(this);
    }

  setSearchTopStories(result) {
    this.setState({ result });
    }

  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error);
    }

  componentDidMount() {
    const { searchTerm } = this.state;
  
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
    }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
    }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({ 
      result: { ...this.state.result, hits: updatedHits } 
    });
  }
  
  render() {   
    const { searchTerm, result } = this.state;

   // if (!result) { return null; }

    return (
      <div className="page">
        <div className="interations">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        { result &&
            <Table 
              list={result.hits}
             // pattern={searchTerm}
              onDismiss={this.onDismiss}  
            />
          //: null
        } 
      </div>  
    ); 
  } 
}
/*
class Search extends Component {
  render() {
    const { value, onChange, children } = this.props;
      return (
      <form>
        {children} <input
          type="text"
          value={value}
          onChange={onChange}
        />
      </form>
    );
  }
}*/

const Table = ({ list, onDismiss }) =>
  <div className='table'>
    {list.map(item =>
      <div key={item.objectID} className='table-row'>
        <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>
          {item.author}
        </span>
        <span style={{ width: '10%' }}>
          {item.num_comments}
        </span>
        <span style={{ width: '10%' }}>
          {item.points}
        </span>
        <span style={{ width: '10%' }}>
          <button onClick={() => onDismiss(item.objectID)}
          className='button-inline'>
            Dismiss
          </button>
        </span>
      </div>
    )}
  </div>

class Button extends Component {
  render() {
    const {
      onClick,
      className = '',
      children,
    } = this.props;
  
    return (
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>
    );
  }
}

const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>

export default App;