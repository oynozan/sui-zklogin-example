

import { FaTwitch } from "react-icons/fa6";
import './styles/modal.css';

export default function LoginModal({
    set,
    loading = true,
    methods
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
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <button
                            onClick={() => { methods["twitch"]() }}
                        >
                            <FaTwitch />Login with Twitch
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}