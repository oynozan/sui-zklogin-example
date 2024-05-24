import { useState } from "react"
import LoginModal from "./LoginModal";

export default function App() {

    const [modal, setModal] = useState(false);

    return (
        <div id="home">
            <header>
                <h1>zkLogin Example</h1>
                <button
                    onClick={() => setModal(true)}
                >
                    Login
                </button>
            </header>

            { modal && <LoginModal set={setModal} /> }
        </div>
    )
}