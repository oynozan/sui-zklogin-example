import { fromB64 } from "@mysten/bcs";
import { useEffect, useState } from "react";
import { SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { generateNonce, generateRandomness } from '@mysten/zklogin';
import LoginModal from "./LoginModal";

const suiClient = new SuiClient({ url: "https://fullnode.devnet.sui.io" });

export default function App() {

    const [modal, setModal] = useState(false);
    const [ephemeralKeyPair, setEphemeralKeyPair] = useState(null);
    const [randomness, setRandomness] = useState(null);
    const [userSalt, setUserSalt] = useState(null);
    const [maxEpoch, setMaxEpoch] = useState(0);
    const [nonce, setNonce] = useState(null);

    useEffect(() => {
        (async() => {
            const privateKey = window.sessionStorage.getItem('KEY_PAIR_SESSION_STORAGE_KEY');
            let ephemeralKeyPair_;
            if (privateKey) {
                ephemeralKeyPair_ = Ed25519Keypair.fromSecretKey(fromB64(privateKey));
                setEphemeralKeyPair(ephemeralKeyPair_);
            } else {
                // Generate ephemeral key pair
                ephemeralKeyPair_ = new Ed25519Keypair();
                setEphemeralKeyPair(ephemeralKeyPair_);
    
                // Set as session storage variable
                window.sessionStorage.setItem(
                    'KEY_PAIR_SESSION_STORAGE_KEY',
                    ephemeralKeyPair_.export().privateKey
                );
            }
    
            let randomness_ = window.sessionStorage.getItem('RANDOMNESS_SESSION_STORAGE_KEY');
            if (randomness_) setRandomness(randomness_);
            else {
                // Generate randomness
                randomness_ = generateRandomness();
                setRandomness(randomness_);
    
                // Set as session storage variable
                window.sessionStorage.setItem(
                    'RANDOMNESS_SESSION_STORAGE_KEY',
                    randomness_
                );
            }
    
            let userSalt_ = window.localStorage.getItem('USER_SALT_LOCAL_STORAGE_KEY');
            if (userSalt_) setUserSalt(userSalt_);
            else {
                // Generate user salt
                userSalt_ = generateRandomness();
                setUserSalt(userSalt_);
    
                // Set as session storage variable
                window.localStorage.setItem(
                    'USER_SALT_LOCAL_STORAGE_KEY',
                    userSalt_
                );
            }
    
            let maxEpoch_ = window.localStorage.getItem('MAX_EPOCH_LOCAL_STORAGE_KEY');
            if (maxEpoch_) setMaxEpoch(Number(maxEpoch_));
            else {
                // Find maximum epoch
                const { epoch } = await suiClient.getLatestSuiSystemState();
                maxEpoch_ = String(Number(epoch));
                setMaxEpoch(maxEpoch_);

                // Set as session storage variable
                window.localStorage.setItem(
                    'MAX_EPOCH_LOCAL_STORAGE_KEY',
                    maxEpoch_
                );
            }

            // Generate nonce
            let nonce_ = generateNonce(
                ephemeralKeyPair_.getPublicKey(),
                maxEpoch_,
                randomness_
            );

            setNonce(nonce_);
        })()
    }, []);

    // Login methods
    async function login_twitch() {
        if (!nonce) {
            var nonce_ = generateNonce(
                ephemeralKeyPair.getPublicKey(),
                maxEpoch,
                randomness
            );
    
            setNonce(nonce_);
        }

        // Redirect to the login page
        const params = new URLSearchParams({
            client_id: process.env.REACT_APP_OPENID_CLIENT_ID,
            force_verify: 'true',
            lang: 'en',
            login_type: 'login',
            redirect_uri: window.location.href,
            response_type: 'id_token',
            scope: 'openid',
            nonce: nonce ? nonce : nonce_
        });

        const loginURL = `https://id.twitch.tv/oauth2/authorize?${params}`;
        window.location.replace(loginURL);
    }

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

            { modal && (
                <LoginModal
                    set={setModal}
                    loading={ !Boolean(nonce) }
                    methods={{
                        "twitch": login_twitch
                    }}
                />
            )}
        </div>
    )
}