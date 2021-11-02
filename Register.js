import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signup } from '../actions/auth';
import '../style/register.css';
import logoImage from '../img/SKKUsilLogo.png';
import passImage from '../img/register/m_icon_pass.png';
import disabledImage from '../img/register/m_icon_check_disable.png';

const Register = ({ signup, isAuthenticated }) => {

    // 비번창 스타일 컨트롤 위한 useref
    const pass1 = useRef(null);
    const pass2 = useRef(null);
    const err = useRef(null);

    // body style & navbar 속성 변경
    useEffect(() => {
        document.body.className='Register-body';
        const navbarChange1 = document.querySelector('.Navbar-mobile_list');
        navbarChange1.style.borderTop = '';
        navbarChange1.style.zIndex = '2';
    });

    const items = [
        '글로벌경영학과', '글로벌경제학과', '글로벌리더학과', '글로벌바이오메디컬공학과',
        '유학동양학과', '국어국문학과', '영어영문학과', '프랑스어문학과', '러시아어문학과',
        '중어중문학과', '독어독문학과', '한문학과', '사학과', '철학과', '문헌정보학과',
        '행정학과', '정치외교학과', '미디어커뮤니케이션학과', '사회학과', '사회복지학과',
        '심리학과', '소비자학과', '아동청소년학과', '경제학과', '통계학과',
        '생명과학과', '수학과', '물리학과', '화학과',
        '식품생명공학과', '바이오메카트로닉스학과', '융합생명공학과', '유전공학과',
        '화학공학/고분자시스템공학부', '고분자시스템공학과', '신소재공학부', '기계공학부', '건설환경공학부', '건축토목공학부', '조경학과', '시스템경영공학과', '건축학과', '나노공학과',
        '경영학과',
        '교육학과', '한문교육과', '수학교육과', '컴퓨터교육과',
        '미술학과', '무용학과', '디자인학과', '영상학과', '연기예술학과', '의상학과',
        '전자전기공학부', '반도체시스템공학과', '컴퓨터공학과', '소프트웨어학과',
        '약학과', '스포츠과학과', '의예과', '의학과',
        '인공지능융합전공', '데이터사이언스융합전공', '컬처앤테크놀로지융합전공', 
        '인문과학계열', '사회과학계열', '자연과학계열', '공학계열',
    ];

    const [accountCreated, setAccountCreated] = useState(false);
    const [formData, setFormData] = useState({
        email_name: '',
        email_address: '@skku.edu',
        password: '',
        re_password: '',
        name: '',
        major: '',
        student_id: ''
    });

    /* 사용자가 입력한 글자로 시작하는 전공을 담아두는 배열 */
    const [suggestionsList, setSuggestions] = useState([]);

    const { email_name, email_address, password, re_password, name, major, student_id } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    /* 사용자가 전공을 입력하는 동안 실행되는 함수 */
    const onMajorChange = e => {
        e.preventDefault();
        const value = e.target.value;
        let suggestions = [];
        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, 'i');
            suggestions = items.sort().filter(v => regex.test(v));
        }
        setSuggestions(suggestions);
        setFormData({ ...formData, [e.target.name]: value });
    }


    const suggestionSelected = (value) => {
        setFormData({...formData, major: value});
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
        const email = email_name + email_address;
        const last_login = null;

        if (password === re_password) {
            signup(email, password, re_password, name, major, student_id, last_login);
            setAccountCreated(true);
        }
    };

    if (isAuthenticated) {
        // navbar 속성 변경
        const navbarChange2 = document.querySelector('.Navbar-mobile_list');
        navbarChange2.style.borderTop = 'rgb(187, 187, 187) 1px solid';
        navbarChange2.style.zIndex = '';

        return <Redirect to = '/' />
    }
    if (accountCreated) {
        // navbar 속성 변경
        const navbarChange3 = document.querySelector('.Navbar-mobile_list');
        navbarChange3.style.borderTop = 'rgb(187, 187, 187) 1px solid';
        navbarChange3.style.zIndex = '';

        return <Redirect to = '/login' />
    }

    // useref로 잡은 값들이 초기에는 null이므로 초기 방어
    if ((pass1.current !== null) && (pass2.current !== null) && (err.current !== null)) {
        // 비밀번호 일치 여부
        if (password !== '' && re_password !== '') {
            // 일치 경우
            if (password !== re_password) {
                pass1.current.className = "Register-fail";
                pass2.current.className = "Register-fail";
                err.current.style.visibility = "visible";
                err.current.style.display = "";
            // 불일치 경우
            } else {
                pass1.current.className = "Register-success";
                pass2.current.className = "Register-success";
                err.current.style.visibility = "hidden";
                err.current.style.display = "none";
            }

        } else {
            pass1.current.className = "Register-box int_pass";
            pass2.current.className = "Register-box int_pass_check";
            err.current.style.visibility = "hidden";
            err.current.style.display = "none";
        }
    }

    return(
        <div>
            <div className="Register-back">
                <button onClick="history.back()"><i className="fa fa-chevron-left"></i></button>
            </div>
            <div className="Register-logo">
                <img src={logoImage} />
            </div>
            <div id="wrapper">
            <form onSubmit={e => onSubmit(e)}>
                {/* content */}
                <div id="content">
                    {/* E-mail */}
                    <div>
                        <h3 className="Register-join_title"><label htmlFor="Email">킹고 이메일 인증</label></h3>
                        <div id="Email_wrap">
                            {/* E-mail ID */}
                            <div id="Email_ID">
                                <span className="Register-box">
                                    <input 
                                        type="text" 
                                        id="ID" 
                                        className="Register-int"
                                        placeholder="이메일 앞 주소" 
                                        name='email_name'
                                        value={email_name}
                                        onChange={e => onChange(e)}
                                        required
                                    />
                                </span>
                            </div>
                            {/* E-mail Type */}
                            <div id="Email_type">
                                <span className="Register-box">
                                    <select 
                                        id="TYPE"
                                        className="Register-sel"
                                        name='email_address'
                                        value={email_address}
                                        onChange={e => onChange(e)}
                                        required
                                    >
                                        <option>선택</option>
                                        <option value="@skku.edu">@skku.edu</option>
                                        <option value="@g.skku.edu">@g.skku.edu</option>
                                    </select>
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* PW1 */}
                    <div>
                        <h3 className="Register-join_title"><label htmlFor="pswd1">비밀번호</label></h3>
                        <span className="Register-box int_pass" ref={pass1}>
                            <input 
                                type='password'
                                id="pswd1" 
                                className="Register-int" 
                                maxlength="20"
                                minLength='6'
                                name='password'
                                value={password}
                                onChange={e => onChange(e)}
                                required
                            />
                            <img src={passImage} id="pswd1_img1" className="Register-pswdImg" />
                        </span>
                    </div>
                    {/* PW Confirm */}
                    <div>
                        <h3 className="Register-join_title"><label htmlFor="pswd2">비밀번호 재확인</label></h3>
                        <span className="Register-box int_pass_check" ref={pass2}>
                            <input 
                                type="password" 
                                id="pswd2" 
                                className="Register-int" 
                                maxlength="20"
                                minLength='6'
                                name='re_password'
                                value={re_password}
                                onChange={e => onChange(e)}
                                required
                            />
                            <img src={disabledImage} id="pswd2_img1" className="Register-pswdImg" />
                        </span>
                        <small style={{color: '#e74c3c', visibility: 'hidden', display: 'none'}} ref={err}>비밀번호 불일치</small>
                    </div>
                    {/* NAME */}
                    <div>
                        <h3 className="Register-join_title"><label htmlFor="name">이름</label></h3>
                        <span className="Register-box int_name">
                            <input 
                                type="text" 
                                id="name" 
                                className="Register-int" 
                                maxlength="20"
                                name='name'
                                value={name}
                                onChange={e => onChange(e)}
                                required
                            />
                        </span>
                    </div>
                    {/* MAJOR */}
                    <div>
                        <h3 className="Register-join_title"><label htmlFor="major">전공</label></h3>
                        {/* className = autoCompleteText 추가 */}
                        <span className="Register-box int_name autoCompleteText"> 
                            <input 
                                type="text" 
                                id="major" 
                                className="Register-int" 
                                maxlength="20"
                                name='major'
                                value={major}
                                onChange={e => onMajorChange(e)}
                                required
                            />
                            {renderSuggestions()}
                        </span>
                    </div>
                    {/* Student Number */}
                    <div>
                        <h3 className="Register-join_title"><label htmlFor="std_number">학번</label></h3>
                        <span className="Register-box int_name">
                            <input 
                                type="text" 
                                id="studentid" 
                                className="Register-int" 
                                maxlength="20"
                                name='student_id'
                                value={student_id}
                                onChange={e => onChange(e)}
                                required
                            />
                        </span>
                    </div>
                    {/* JOIN BTN */}
                    <div className="Register-btn_area">
                        <button type="submit" id="btnJoin">
                            <span>가입하기</span>
                        </button>
                    </div>
                </div> 
            {/* content */}
            </form>
            </div> 
        {/* wrapper */}
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { signup })(Register);