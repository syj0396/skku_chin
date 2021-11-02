import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { create } from '../actions/post';
import '../style/new_lost.css';

const New_lost = ({ create, isAuthenticated, _user }) => {

    useEffect(() => {
        if (isAuthenticated) {
            document.body.className='NL-body';
        }
    });

    let history = useHistory();

    // 게시물 생성되면 목록 화면으로 나가도록 작동
    const [postCreated, setPostCreated] = useState(false);
    // 게시물 관련 값 변경
    const [postData, setPostData] = useState({
        title: '',
        mbti: '',
        content: ''
    });

    /* 사용자가 입력한 알파벳으로 시작하는 MBTI를 담아두는 배열 */
    const [suggestionsList, setSuggestions] = useState([]);

    const { title, mbti, content } = postData;

    const items = [
        'ENFJ', 'ESFJ', 'ENTJ', 'ESTJ', 'ENFP', 'ESFP', 'ENTP', 'ESTP',
        'INFJ', 'ISFJ', 'INTJ', 'ISTJ', 'INFP', 'ISFP', 'INTP', 'ISTP', 
    ];

    const onChange = (e) => {
        setPostData({...postData, [e.target.name]: e.target.value});
    };

    /* 사용자가 MBTI를 입력하는동안 실행되는 함수 */
    const onMbtiChange = e => {
        e.preventDefault();
        const value = e.target.value;
        let suggestions = [];
        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, 'i');
            suggestions = items.sort().filter(v => regex.test(v));
        }
        setSuggestions(suggestions);
        setPostData({ ...postData, [e.target.name]: value });
    }

    const suggestionSelected = (value) => {
        setPostData({...postData, major: value});
        setSuggestions([]);
    }

    const renderSuggestions = () => {
        const suggestions = suggestionsList;
        console.log(suggestions);
        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul>
                {suggestions.map((item) => <li onClick={e => suggestionSelected(item)}>{item}</li>)}
            </ul>
        )
    }

    const onSubmit = e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('user', _user.id);
        formData.append('title', title);
        formData.append('name', _user.name);
        formData.append('major', _user.major);
        formData.append('student_id', _user.student_id);
        formData.append('mbti', mbti);
        formData.append('content', content);

        create(formData);
        setPostCreated(true);
    };

    // 로그인 안 했을 시 로그인 페이지로
    if (!isAuthenticated) {
        return <Redirect to = '/login' />
    }

    // 게시물 등록했을 시 목록 페이지로
    if (postCreated) {
        return <Redirect to = '/' />
    }

    // 뒤로 가기 버튼
    const goBack = () => {
        history.goBack();
    };

    return(
        <div>
            <header className="NL-header"> 
                <div className="NL-back">
                    <button onClick={goBack}><i className="fa fa-chevron-left"></i></button>
                </div>
                <h2>밥약 신청서</h2>
            </header>
            <form onSubmit={e => onSubmit(e)}>
                <div className="NL-new_container">
                    <div className="NL-new_title_input">
                        <input 
                            type="text" 
                            placeholder="게시물 제목" 
                            name='title' 
                            value={title} 
                            onChange={e => onChange(e)} 
                            required 
                        />
                    </div>
                    {/* className = autoCompleteText 추가 */}
                    <div className="NL-new_place_input autoCompleteText">
                        <input 
                            type="text" 
                            placeholder="MBTI" 
                            name='mbti' 
                            value={mbti} 
                            onChange={e => onMbtiChange(e)} 
                            required 
                        />
                        {renderSuggestions()}
                    </div>
                    <div className="NL-new_content_input">
                        <p><textarea
                            name='content'
                            value={content}
                            onChange={e => onChange(e)}
                            placeholder="내용을 기입해주세요." 
                            required
                            /></p>
                    </div>
                    <button className="NL-new_complete" type='submit'>등록하기</button>
                </div>
            </form>
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    _user: state.auth.user
});

export default connect(mapStateToProps, { create })(New_lost);