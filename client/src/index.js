import React from 'react';
import ReactDOM from 'react-dom/client';
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { SuiClientProvider, createNetworkConfig } from "@mysten/dapp-kit";
import App from './App';

import './styles/index.css';

const { networkConfig } = createNetworkConfig({
	devnet: { url: getFullnodeUrl("devnet") },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<SuiClientProvider networks={networkConfig} network="devnet">
		<App />
	</SuiClientProvider>
);