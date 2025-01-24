import styles from './NavBar.module.css';
import { FaHome } from 'react-icons/fa';
import Popup from './Popup/NavPopup';

function NavBar() {

    return (<nav className={styles.navBar}>
        <button className={styles.homeButton}><FaHome /></button>
        <h1 className={styles.navheader}>Song Ranker</h1>
        <Popup ></Popup>
    </nav >);
}
export default NavBar