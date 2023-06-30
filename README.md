

Développement Dapp
# **Construisez votre premier DApp sur Tezos**

Contrats intelligents

Ce guide suppose que vous êtes déjà familiarisé avec les contrats intelligents. Consultez notre guide [Déployez votre premier contrat intelligent](https://tezos.com/developers/docs/tezos-basics/deploy-your-first-smart-contract) pour obtenir ce contexte.

Une application décentralisée ou dapp est une application qui se connecte à une blockchain et fournit des services liés à la blockchain à laquelle elle se connecte.

Vous pouvez utiliser le framework de votre choix pour créer une dapp sur Tezos. Dans cet article, nous utiliserons React.

Le code présenté ici est composé d’extraits que vous pouvez utiliser dans votre application React. Vous apprendrez à configurer un dapp, à connecter et déconnecter un portefeuille, à transférer des tez et à passer un appel de contrat.
## **Installation des packages**
La première étape consiste à installer les packages NPM dont vous avez besoin pour exécuter votre dapp avec la commande suivante :

npm install @taquito/beacon-wallet @taquito/taquito react react-app-rewired react-dom react-scripts typescript

Voici ce que fait chaque package :

- **@taquito/beacon-wallet** : fournit un wrapper pour le SDK Beacon afin de le rendre plus facile à utiliser avec Taquito
- **@taquito/taquito** : la bibliothèque principale pour interagir avec la blockchain Tezos
- **react** : le framework React
- **react-app-rewired** : nécessaire pour apporter des modifications à la configuration React pour Beacon
- **react-dom** : la bibliothèque ReactDOM
- **react-scripts : scripts** et configuration utilisés par Create React App
- **typescript** : pour utiliser TypeScript dans votre projet

Vous aurez également besoin de quelques dépendances de développement :

npm install --save-dev os-browserify stream-browserify buffer

Ces dépendances sont requises pour utiliser Beacon avec Webpack et sont utilisées dans le fichier :config-overrides.js

const webpack = require('webpack')

module.exports = function override(config, env) {

`  `console.log('override')

`  `let loaders = config.resolve

`  `loaders.fallback = {

`    `stream: require.resolve('stream-browserify'),

`    `buffer: require.resolve('buffer'),

`    `os: require.resolve('os-browserify/browser'),

`  `}

`  `config.plugins.push(

`    `new webpack.ProvidePlugin({

`      `Buffer: ['buffer', 'Buffer'],

`    `})

`  `)

`  `return config

}
## **Configuration de l’application**
Une fois l’environnement prêt, vous pouvez créer un fichier qui sera le point d’entrée de votre application.App.tsx

Lorsque l’application est montée, vous importez les différentes classes et composants nécessaires et vous créez une nouvelle instance du fichier . Après cela, vous mettez à jour l’interface utilisateur en fonction de l’état de connexion du portefeuille de l’utilisateur.TezosToolkit

import React, { useState, useEffect } from 'react'

import { TezosToolkit } from '@taquito/taquito'

import type { BeaconWallet } from '@taquito/beacon-wallet'

import ConnectButton from './components/ConnectWallet'

import DisconnectButton from './components/DisconnectWallet'

const App = () => {

`  `const [Tezos, setTezos] = useState<TezosToolkit | null>(null)

`  `const [wallet, setWallet] = useState<BeaconWallet | null>(null)

`  `const [userAddress, setUserAddress] = useState<string>('')

`  `const [userBalance, setUserBalance] = useState<number>(0)

`  `const contractAddress: string = 'KT1...'

`  `useEffect(() => {

`    `const tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')

`    `setTezos(tezos)

`  `})

`  `return (

`    `<div>

`      `<ConnectButton

`        `Tezos={Tezos}

`        `setWallet={setWallet}

`        `setUserAddress={setUserAddress}

`        `setUserBalance={setUserBalance}

`        `setStorage={setStorage}

`        `wallet={wallet}

`      `/>

`      `<DisconnectButton

`        `wallet={wallet}

`        `setUserAddress={setUserAddress}

`        `setUserBalance={setUserBalance}

`        `setWallet={setWallet}

`        `setTezos={setTezos}

`      `/>

`      `<div>Your code here...</div>

`    `</div>

`  `)

}

export default App
## **Connexion/Déconnexion du portefeuille**
Il est recommandé de conserver toutes les fonctions liées à la connexion, aux interactions et à la déconnexion du portefeuille dans leurs composants respectifs.

Vous allez ici créer 2 composants: un responsable de la connexion du portefeuille et un autre responsable de sa déconnexion.

Dans le fichier, vous recevrez diverses données et fonctions du composant principal pour déduire l’état du dapp et le mettre à jour en fonction des actions de l’utilisateur.ConnectButton.tsx

import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'

import { TezosToolkit } from '@taquito/taquito'

import { BeaconWallet } from '@taquito/beacon-wallet'

import {

`  `NetworkType,

`  `BeaconEvent,

`  `defaultEventCallbacks,

} from '@airgap/beacon-dapp'

type ButtonProps = {

`  `Tezos: TezosToolkit

`  `setWallet: Dispatch<SetStateAction<any>>

`  `setUserAddress: Dispatch<SetStateAction<string>>

`  `setUserBalance: Dispatch<SetStateAction<number>>

`  `setStorage: Dispatch<SetStateAction<number>>

`  `contractAddress: string

`  `wallet: BeaconWallet

}

const ConnectButton = ({

`  `Tezos,

`  `setWallet,

`  `setUserAddress,

`  `setUserBalance,

`  `setStorage,

`  `contractAddress,

`  `wallet,

}: ButtonProps): JSX.Element => {

`  `const setup = async (userAddress: string): Promise<void> => {

`    `setUserAddress(userAddress)

`    `// updates balance

`    `const balance = await Tezos.tz.getBalance(userAddress)

`    `setUserBalance(balance.toNumber())

`    `// creates contract instance

`    `const contract = await Tezos.wallet.at(contractAddress)

`    `const storage: any = await contract.storage()

`    `setContract(contract)

`    `setStorage(storage.toNumber())

`  `}

`  `const connectWallet = async (): Promise<void> => {

`    `try {

`      `await wallet.requestPermissions({

`        `network: {

`          `type: NetworkType.GHOSTNET,

`          `rpcUrl: 'https://ghostnet.ecadinfra.com',

`        `},

`      `})

`      `// gets user's address

`      `const userAddress = await wallet.getPKH()

`      `await setup(userAddress)

`    `} catch (error) {

`      `console.log(error)

`    `}

`  `}

`  `useEffect(

`    `() =>

`      `(async () => {

`        `const wallet = new BeaconWallet({

`          `name: 'Tezos React Dapp',

`          `preferredNetwork: NetworkType.GHOSTNET,

`        `})

`        `Tezos.setWalletProvider(wallet)

`        `setWallet(wallet)

`        `const activeAccount = await wallet.client.getActiveAccount()

`        `if (activeAccount) {

`          `const userAddress = await wallet.getPKH()

`          `await setup(userAddress)

`        `}

`      `})(),

`    `[]

`  `)

`  `return (

`    `<div className="buttons">

`      `<button className="button" onClick={connectWallet}>

`        `<span>

`          `<i className="fas fa-wallet"></i>&nbsp; Connect wallet

`        `</span>

`      `</button>

`    `</div>

`  `)

}

export default ConnectButton

Dans le composant, vous recevez des fonctions en tant qu’accessoires pour mettre à jour l’interface utilisateur générale une fois que l’utilisateur a déconnecté son portefeuille.DisconnectButton.tsx

Il est essentiel dans cette étape de nettoyer l’état de la dapp afin que l’utilisateur puisse reconnecter son portefeuille comme s’il venait de charger le dapp et de réinitialiser l’interface utilisateur à ce qu’elle était avant que l’utilisateur ne connecte son portefeuille.

import React, { Dispatch, SetStateAction } from 'react'

import { BeaconWallet } from '@taquito/beacon-wallet'

import { TezosToolkit } from '@taquito/taquito'

interface ButtonProps {

`  `wallet: BeaconWallet | null

`  `setUserAddress: Dispatch<SetStateAction<string>>

`  `setUserBalance: Dispatch<SetStateAction<number>>

`  `setWallet: Dispatch<SetStateAction<any>>

`  `setTezos: Dispatch<SetStateAction<TezosToolkit>>

}

const DisconnectButton = ({

`  `wallet,

`  `setUserAddress,

`  `setUserBalance,

`  `setWallet,

`  `setTezos,

}: ButtonProps): JSX.Element => {

`  `const disconnectWallet = async (): Promise<void> => {

`    `if (wallet) {

`      `await wallet.clearActiveAccount()

`    `}

`    `setUserAddress('')

`    `setUserBalance(0)

`    `setWallet(null)

`    `const tezosTK = new TezosToolkit('https://ghostnet.ecadinfra.com')

`    `setTezos(tezosTK)

`  `}

`  `return (

`    `<div className="buttons">

`      `<button className="button" onClick={disconnectWallet}>

`        `<i className="fas fa-times"></i>&nbsp; Disconnect wallet

`      `</button>

`    `</div>

`  `)

}

export default DisconnectButton
## **Transfert de la tez**
Vous pouvez ajouter une fonctionnalité à votre dapp qui permet aux utilisateurs de transférer tez de leur compte vers un autre compte.

Le flux d’envoi d’une transaction de transfert est le suivant :

1. Vous utilisez la propriété de l’instance pour appeler la méthodewalletTezosToolkittransfer
1. La méthode prend un objet comme paramètre avec une propriété pour l’adresse du destinataire et une propriété pour le montant en tez à envoyertransfertoamount
1. Vous appelez la méthode sur l’objet retourné par sendtransfer
1. Cela retourne un objet d’opération, vous pouvez attendre la confirmation en appelant la méthode (si aucun paramètre n’est passé, le nombre de confirmations par défaut est 1)confirmation

import React, { useState, Dispatch, SetStateAction } from 'react'

import { TezosToolkit } from '@taquito/taquito'

const Transfers = ({

`  `Tezos,

`  `setUserBalance,

`  `userAddress,

}: {

`  `Tezos: TezosToolkit

`  `setUserBalance: Dispatch<SetStateAction<number>>

`  `userAddress: string

}): JSX.Element => {

`  `const [recipient, setRecipient] = useState<string>('')

`  `const [amount, setAmount] = useState<string>('')

`  `const [loading, setLoading] = useState<boolean>(false)

`  `const sendTransfer = async (): Promise<void> => {

`    `if (recipient && amount) {

`      `setLoading(true)

`      `try {

`        `const op = await Tezos.wallet

.transfer({ to: recipient, amount: parseInt(amount) })

.send()

`        `await op.confirmation()

`        `setRecipient('')

`        `setAmount('')

`        `const balance = await Tezos.tz.getBalance(userAddress)

`        `setUserBalance(balance.toNumber())

`      `} catch (error) {

`        `console.log(error)

`      `} finally {

`        `setLoading(false)

`      `}

`    `}

`  `}

`  `return (

`    `<div id="transfer-inputs">

`      `<input

`        `type="text"

`        `placeholder="Recipient"

`        `value={recipient}

`        `onChange={(e) => setRecipient(e.target.value)}

`      `/>

`      `<input

`        `type="number"

`        `placeholder="Amount"

`        `value={amount}

`        `onChange={(e) => setAmount(e.target.value)}

`      `/>

`      `<button

`        `className="button"

`        `disabled={!recipient && !amount}

`        `onClick={sendTransfer}

`      `>

`        `{loading ? (

`          `<span>

`            `<i className="fas fa-spinner fa-spin"></i>&nbsp; Please wait

`          `</span>

`        `) : (

`          `<span>

`            `<i className="far fa-paper-plane"></i>&nbsp; Send

`          `</span>

`        `)}

`      `</button>

`    `</div>

`  `)

}

export default Transfers
## **Envoi d’un appel de contrat**
L’une des caractéristiques les plus intéressantes d’une dapp est la possibilité d’interagir avec des contrats intelligents sur la chaîne.

Voici comment cela fonctionne :

1. Vous utilisez l’instance de la pour créer l’abstraction de contrat pour le contrat que vous ciblezTezosToolkit
1. L’abstraction du contrat expose une propriété qui contient des méthodes nommées d’après chaque point d’entrée du contratmethods
1. Vous appelez le point d’entrée que vous ciblez et vous passez les paramètres requis
1. Cela retourne un objet avec une méthode que vous devez appeler pour envoyer la transactionsend
1. Après avoir été envoyé, Taquito retourne un objet d’opération avec une propriété. Par défaut, Taquito attend 1 confirmationconfirmation
1. Une fois la transaction confirmée, vous pouvez appeler la méthode sur l’abstraction du contrat pour obtenir le stockage mis à jour du contratstorage

import React, { useState, Dispatch, SetStateAction } from 'react'

import { TezosToolkit, WalletContract } from '@taquito/taquito'

interface UpdateContractProps {

`  `contract: WalletContract | any

`  `setUserBalance: Dispatch<SetStateAction<any>>

`  `Tezos: TezosToolkit

`  `userAddress: string

`  `setStorage: Dispatch<SetStateAction<number>>

}

const UpdateContract = ({

`  `contract,

`  `setUserBalance,

`  `Tezos,

`  `userAddress,

`  `setStorage,

}: UpdateContractProps) => {

`  `const [loadingIncrement, setLoadingIncrement] = useState<boolean>(false)

`  `const [loadingDecrement, setLoadingDecrement] = useState<boolean>(false)

`  `const increment = async (): Promise<void> => {

`    `setLoadingIncrement(true)

`    `try {

`      `const op = await contract.methods.increment(1).send()

`      `await op.confirmation()

`      `const newStorage: any = await contract.storage()

`      `if (newStorage) setStorage(newStorage.toNumber())

`      `setUserBalance(await Tezos.tz.getBalance(userAddress))

`    `} catch (error) {

`      `console.log(error)

`    `} finally {

`      `setLoadingIncrement(false)

`    `}

`  `}

`  `const decrement = async (): Promise<void> => {

`    `setLoadingDecrement(true)

`    `try {

`      `const op = await contract.methods.decrement(1).send()

`      `await op.confirmation()

`      `const newStorage: any = await contract.storage()

`      `if (newStorage) setStorage(newStorage.toNumber())

`      `setUserBalance(await Tezos.tz.getBalance(userAddress))

`    `} catch (error) {

`      `console.log(error)

`    `} finally {

`      `setLoadingDecrement(false)

`    `}

`  `}

`  `if (!contract && !userAddress) return <div>&nbsp;</div>

`  `return (

`    `<div className="buttons">

`      `<button

`        `className="button"

`        `disabled={loadingIncrement}

`        `onClick={increment}

`      `>

`        `{loadingIncrement ? (

`          `<span>

`            `<i className="fas fa-spinner fa-spin"></i>&nbsp; Please wait

`          `</span>

`        `) : (

`          `<span>

`            `<i className="fas fa-plus"></i>&nbsp; Increment by 1

`          `</span>

`        `)}

`      `</button>

`      `<button className="button" onClick={decrement}>

`        `{loadingDecrement ? (

`          `<span>

`            `<i className="fas fa-spinner fa-spin"></i>&nbsp; Please wait

`          `</span>

`        `) : (

`          `<span>

`            `<i className="fas fa-minus"></i>&nbsp; Decrement by 1

`          `</span>

`        `)}

`      `</button>

`    `</div>

`  `)

}

export default UpdateContract

Plus d’informations

Vous pouvez trouver le code de cette dapp dans [ce référentiel GitHub.](https://github.com/ecadlabs/taquito-react-template)


[](https://tezos.com/developers/docs/)
# [**Tezos DocsBêta**](https://tezos.com/developers/docs/)
Rechercher des documentsCtrl K

Thème[](https://github.com/trilitech/docs-staging)

[](https://github.com/trilitech/docs-staging)
- ## **Bases de Tezos**
  - [Présentation de Tezos Blockchain](https://tezos.com/developers/docs/tezos-blockchain-overview/)
  - [Premiers pas avec Octez](https://tezos.com/developers/docs/tezos-basics/get-started-with-octez/)
  - [Déployez votre premier contrat intelligent](https://tezos.com/developers/docs/tezos-basics/deploy-your-first-smart-contract/)
  - [Protocole Tezos & Shell](https://tezos.com/developers/docs/tezos-basics/tezos-protocol-and-shell/)
  - [Réseaux de test](https://tezos.com/developers/docs/tezos-basics/test-networks/)
  - [Langages de contrat intelligent](https://tezos.com/developers/docs/tezos-basics/smart-contract-languages/)
- ## **DeFi, NFT et jeux**
  - [Jetons DeFi](https://tezos.com/developers/docs/defi/defi-tokens/)
  - [Créer un NFT](https://tezos.com/developers/docs/nft/create-an-nft/)
  - [Créer un marché NFT](https://tezos.com/developers/docs/nft/build-an-nft-marketplace/)
  - [SDK Tezos pour Unity](https://tezos.com/developers/docs/gaming/tezos-sdk-for-unity/)
- ## **Développement Dapp**
  - [Créez votre premier DApp](https://tezos.com/developers/docs/dapp-development/build-your-first-dapp/)
  - [Taquito](https://tezos.com/developers/docs/dapp-development/taquito/)
  - [Indexeurs](https://tezos.com/developers/docs/dapp-development/indexers/)
  - [Portefeuilles et SDK Beacon](https://tezos.com/developers/docs/dapp-development/wallets-and-beacon-sdk/)
  - [Meilleures pratiques du cadre](https://tezos.com/developers/docs/dapp-development/framework-best-practices/)



# Taquito React template

A minimal React setup for starting developing Tezos DApps quickly with Taquito.

## Getting Started

1. Make sure you have https://nodejs.org/ installed on your computer
2. Create a new repository from taquito-boilerplate by clicking "Use this template".
3. Clone your new repository:

   `git clone <YOUR_REPOSITORY_URL>`

3. Change your current working directory to the newly cloned repository directory.
4. Install dependencies:

   `npm install`

5. Start development server:

   `npm run start`

6. Open https://localhost:3000 in your browser to see a sample application.
