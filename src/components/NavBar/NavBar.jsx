import './NavBar.module.css';
import { FaHome } from 'react-icons/fa';
import Popup from './Popup/NavPopup';

function NavBar() {

    return (<nav>
        <button><FaHome /></button>
        <h1>Song Ranker</h1>
        <Popup ></Popup>
    </nav >);
}
export default NavBar