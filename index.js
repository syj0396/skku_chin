import React, { useEffect, useState } from 'react';
import './style.css';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { read, logoutPost } from '../../actions';
import { Link } from 'react-router-dom';

const HomePage = () => {

    document.body.className='SL-body';

    const dispatch = useDispatch();
    const post = useSelector(state => state.post.data);
    const [searchItem, setSearchItem] = useState("");
    const [filterList, setFilterList] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    //const [optionAllList, setOptionAllList] = useState([]);
    const [previousList, setPreviousList] = useState([]);

    useEffect(() => {
        dispatch(read())
        .then((lists) => {
            setFilterList(lists);
        })
    }, [])

    // componentWillUnmount
    useEffect(() => {
        return () => {
            // cleanup
            dispatch(logoutPost());
        }
    }, [])

    const handleSearch = (e) => {
        setSearchItem(e.target.value);
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        let searchList = filterList;
        
        if (searchItem && searchList) {
            
            searchList = searchList.filter((list) => list.title.match(searchItem));

            if (Object.keys(searchList).length === 0) {
                searchList = filterList;
                searchList = searchList.filter((list) => list.name.match(searchItem));

                if (Object.keys(searchList).length === 0) {
                    searchList = filterList;
                    searchList = searchList.filter((list) => list.major.match(searchItem));

                    if (Object.keys(searchList).length === 0) {
                        searchList = filterList;
                        searchList = searchList.filter((list) => list.student_id.match(searchItem));

                        if (Object.keys(searchList).length === 0) {
                            searchList = filterList;
                            searchList = searchList.filter((list) => list.mbti.match(searchItem));

                            if (Object.keys(searchList).length === 0) {
                                searchList = filterList;
                                searchList = searchList.filter((list) => list.date.match(searchItem));

                                if (Object.keys(searchList).length === 0) {
                                    searchList = filterList;
                                    searchList = searchList.filter((list) => list.place.match(searchItem));
                                }
                            }
                        }
                    }
                }
                
            }
        }
        
        setFilterList(searchList);
        setPreviousList(filterList);
    }

    const getDate = (date) => {
        const created_seconds = new Date(date)/1000;
        const now_seconds = new Date().getTime()/1000;
        const difference_time = now_seconds - created_seconds;
        let time;

        if (difference_time < 60) {
            time = `${Math.floor(difference_time)}초 전`;
        } else if (difference_time < 3600) {
            time = `${parseInt(difference_time/60)}분 전`;
        } else if (difference_time < 86400) {
            time = `${parseInt(difference_time/3600)}시간 전`
        } else if (difference_time < 2592000) {
            time = `${parseInt(difference_time/86400)}일 전`
        } else if (difference_time < 31104000) {
            time = `${parseInt(difference_time/2592000)}달 전`
        } else {
            time = `${parseInt(difference_time/31104000)}년 전`
        }

        return time;
    }

    let renderList = () => (
        <div>Loading</div>
    );

    const filterFinish = (e) => {
        //e.preventDefault();
        // checkbox 체크 해제하면
        if (isChecked) {
            setIsChecked(false);
            setFilterList(previousList);
        }
        // checkbox 체크하면
        else {
            setIsChecked(true);
            let optionTrueList = filterList;
            setPreviousList(filterList); //option = true, option = false 모두 저장
            if (optionTrueList) { //option = true만 빼서 저장
                optionTrueList = optionTrueList.filter((list) => list.option);
            }
            setFilterList(optionTrueList);
        }
    }
    
    if (filterList) {

        renderList = filterList.map((list) => {
        console.log(list.create_date);
        return (
                <Link
                    to={{
                        pathname: `/detail/${list.id}`
                    }}
                    >
                    {/* 개인습득물 - 개별 아이템 indiItem */}
                    <ul className="indi_list">
                        <li>
                            <div className="indItem-info">
                                <span className="indItem-name"> {list.title} </span>
                                <span className="indItem-date"> {getDate(list.create_date)} </span>
                                <br/>
                                <br/>
                                <div className="indItem-loca"> {list.name} / {list.major} / {list.student_id.slice(2,4)} </div>
                                <span className="indItem-sort"> 시간: {list.date}  / 장소: {list.place} </span>
                                <span className="indItem-color"> {list.mbti} </span>
                            </div>
                        </li>
                    </ul>
                </Link>
            );
        });
    }
    
    return (
        <Layout>
            <div>
                {/* header */}
                <div className="SL-header">
                    <h2>밥약 게시판</h2>
                </div>
                {/* 검색창 / search_container */}
                <form onSubmit= {e => handleSearchSubmit(e)}>
                    <div className="SL-search_container">
                        <input 
                            type="text"
                            value={searchItem}
                            className="SL-search_text" 
                            placeholder="밥약 검색"
                            onChange= {e => handleSearch(e)}
                        />
                        <button type="submit" className="SL-search_btn">검색</button>
                    </div> 
                </form>
                {/* 밥약 마감 제외 check box */}
                <label>
                    <input 
                    type="checkbox"
                    checked={isChecked}
                    onChange = {e => filterFinish(e)} 
                />
                밥약 마감 제외
                </label>
                {/* 개인습득물 전체 틀 indi_list */}
                <div className="indi_item">
                    {renderList}
                </div>
            </div>
        </Layout>
    );
}

export default HomePage;