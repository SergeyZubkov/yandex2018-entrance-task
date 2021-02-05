import logo from '../logo.svg'
import Button from '../button/Button'
import './Header.css'

import {Link, useLocation} from "react-router-dom";
import { set } from 'date-fns';
import workingHours from '../scedule/utils/workingHours';

function Header() {
    const location = useLocation()

    const handleTransition = () => {  
        //если считывать state в основном теле/раньше, то он будет undefined
        let {pickedStartDate} = location.state||{}

        pickedStartDate = set(pickedStartDate, {
            hours: workingHours.start.getHours(),
            minutes: workingHours.start.getMinutes()
        })
        console.log("working hours", workingHours.start.getTime())
        return {
            pathname: "/formEvent",
            state: {
                pickedStartDate
            }
        }
    }
    return (
        <header className='header'>
            <div className="header__top">
                <Link to='/'>
                    <img src={logo} alt="Logo"/>
                </Link>
                <Link to={handleTransition}>
                    <Button>
                        Создать встречу
                    </Button>
                </Link>
            </div>
        </header>
    )
}

export default Header