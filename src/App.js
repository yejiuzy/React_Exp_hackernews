import React, {Component} from 'react';
import './App.css';

// 定义常量
const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1/';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage='

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      results: null,     // 空的列表结果
      searchKey: '',
      searchTerm: DEFAULT_QUERY,   // 默认搜索词
    }

    // 类方法绑定
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  };

  // 将获取到的数据存到result里
  setSearchTopStories(result) {
    const {hits, page} = result;
    const {searchKey, results} = this.state;

    const oldHits = results && results[searchKey]
                    ? results[searchKey].hits
                    : [];

    const updateHits = [
      ...oldHits,
      ...hits
    ];
    this.setState({
      results: {
        ...results,
        [searchKey]: {hits: updateHits, page}
      }
    })
  };

  // 异步请求数据
  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)  // 模板字符串
    .then(response => response.json())  // 转化成json格式的数据结构
    .then(result => this.setSearchTopStories(result))  // 处理后的响应赋值给state中的结果
    .catch(e => e);
  };


  // 数据变化更新状态
  onSearchChange(event) {
    this.setState({searchTerm: event.target.value,})
  };

  // onDismiss键忽略项方法
  onDismiss(id) {
    const {searchKey, results} = this.state;
    const {hits, page} = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updateHits = hits.filter(isNotId);
    this.setState({
      // result: Object.assign({}, this.state.result, {hits: updateHits})
      results: {...results, [searchKey]: {hits: updateHits, page}}
    })
  };

  onSearchSubmit(event) {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});

    if(this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  };

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  };

  // 生命周期函数（异步请求数据）
  componentDidMount() {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }


  // 渲染函数
  render() {
    // console.log(this.state);
    const {searchTerm, results, searchKey} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;   // 默认分页为0
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    // if(!) return null;  // 通过返回null来不渲染任何东西
    return (
      <div className='page'>
        <div className='interactions'>
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
          onSubmit = {this.onSearchSubmit}
        >
        Search
        </Search>
        </div>
        <Table
          list = {list}
          onDismiss = {this.onDismiss}
        />
        <div className='interactions'>
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
          More
          </Button>
        </div>
      </div>
    );
  }
}

// 搜索组件
const Search = ({value, onChange, onSubmit, children}) =>
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

// Table组件
const Table = ({list, onDismiss}) =>
      <div className='table'>
        {list.map(item =>
          <div key={item.objectID} className='table-row'>
            <span style={{width: '40%'}}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{width: '30%'}}>{item.author}</span>
            <span style={{width: '10%'}}>{item.num_comments}</span>
            <span style={{width: '10%'}}>{item.points}</span>
            <span style={{width: '10%'}}>
              <Button onClick={() => onDismiss(item.objectID)} className='button-inline'>
                Dismiss
              </Button>
            </span>
          </div>
        )}
      </div>

// 按钮组件
const Button = ({onClick, className = '', children}) =>
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>
export default App;