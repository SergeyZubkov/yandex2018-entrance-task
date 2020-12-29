import logo from '../logo.svg'
import Button from '../button/Button'
import './Header.css'

function Header() {
    return (
        <header className='header'>
            <div className="header__top">
                <img src={logo} alt="Logo"/>
                <Button>
                    Создать встречу
                </Button>
            </div>
        </header>
    )
}

export default Header