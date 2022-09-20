import React, {Component} from 'react';
import './index.css';
import Search from '../Search';
import Table from '../Table';
import Button from '../Button';

import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP
} from '../../constants';



class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      results: null,     // 空的列表结果
      searchKey: '',
      searchTerm: DEFAULT_QUERY,   // 默认搜索词
      error: null,
      isLoading: false,
      sortKey: 'NONE',
    }

    // 类方法绑定
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.onSort = this.onSort.bind(this);
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
      },
      isLoading: false,
    })
  };

  // 异步请求数据
  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({isLoading: true});
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)  // 模板字符串
    .then(response => response.json())  // 转化成json格式的数据结构
    .then(result => this.setSearchTopStories(result))  // 处理后的响应赋值给state中的结果
    .catch(e => this.setState({error: e}));
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

  // 排序关键字
  onSort(sortKey) {
    this.setState({sortKey});
  }

  // 生命周期函数（异步请求数据）
  componentDidMount() {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }


  // 渲染函数
  render() {
    // console.log(this.state);
    const {searchTerm, results, searchKey, error, isLoading, sortKey} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;   // 默认分页为0
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    // if(!) return null;  // 通过返回null来不渲染任何东西
    // if(error) {
    //   return <p>Something went wrong.</p>
    // }
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
        {
          error
          ? <div className='interactions'>
              <p>Something went wrong.</p>
          </div>
          : <Table
              list = {list}
              onDismiss = {this.onDismiss}
              sortKey = {sortKey}
              onSort = {this.onSort}
            />
        }
        <div className='interactions'>
          <ButtonwithLoading
            isLoading={isLoading}
            onClick = {() => this.fetchSearchTopStories(searchKey, page + 1)}>
              More
            </ButtonwithLoading>
        </div>
      </div>
    );
  }
}

const Loading = () => {
  <div>Loading...</div>
}

// const withFoo = (Component) => (props) => {
//   <Component {...props} />
// }

const withLoading = (Component) => ({isLoading, ...rest}) => {
  isLoading
  ? <Loading />
  : <Component {...rest} />
}

const ButtonwithLoading = withLoading(Button);

export default App;
export {
  Button,
  Search,
  Table,
};