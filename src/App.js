import React, {Component} from 'react';
import './App.css';

// 网络请求
const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1/';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      result: null,     // 空的列表结果
      searchTerm: DEFAULT_QUERY,   // 默认搜索词
    }

    // 类方法绑定
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  };

  // 将获取到的数据存到result里
  setSearchTopStories(result) {
    this.setState({result});
  };

  // 异步请求数据
  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)  // 模板字符串
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
    const isNotId = item => item.objectID !== id;
    const updateHits = this.state.result.hits.filter(isNotId);
    this.setState({
      // result: Object.assign({}, this.state.result, {hits: updateHits})
      result: {...this.state.result, hits: updateHits}
    })
  };

  onSearchSubmit() {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
  };

  // 生命周期函数（异步请求数据）
  componentDidMount() {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  render() {
    // console.log(this.state);
    const {searchTerm, result} = this.state;
    if(!result) return null;  // 通过返回null来不渲染任何东西
    return (
      <div className='page'>
        <div className='interactions'>
        <Search 
          value={searchTerm}
          onChange={this.onSearchChange} 
        >
          Search
        </Search>
        </div>
        {
          result
          ? <Table 
              list = {result.hits}
              pattern = {searchTerm}
              onDismiss = {this.onDismiss}
            />
          : null
        }
        
      </div>
    );
  }
}

// 搜索组件
const Search = ({value, onChange, children}) => 
      <form>
        {children}
        <input
          type="text"
          value={value}
          onChange={onChange}
        />
      </form>

// Table组件
const Table = ({list, pattern, onDismiss}) => 
      <div className='table'>
        {list.filter(isSearched(pattern)).map(item =>
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
