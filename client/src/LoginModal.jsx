import { FaSlack, FaGoogle, FaFacebook } from "react-icons/fa6";

import './styles/modal.css';

export default function LoginModal({
    set
}) {
    return (
        <div
            className="modal outer"
            onClick={e => {
                if (e.target === e.currentTarget) set(false);
            }}
        >
            <div className="inner">
                <h5>Login</h5>
                <button><FaFacebook />Login with Facebook</button>
                <button><FaGoogle />Login with Google</button>
                <button><FaSlack />Login with Slack</button>
            </div>
        </div>
    )
}