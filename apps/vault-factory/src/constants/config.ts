import { CreateWalletFn } from '@rainbow-me/rainbowkit/dist/wallets/Wallet'
import {
  argentWallet,
  braveWallet,
  coin98Wallet,
  coinbaseWallet,
  imTokenWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  tahoWallet,
  trustWallet,
  uniswapWallet,
  walletConnectWallet,
  xdefiWallet,
  zerionWallet
} from '@rainbow-me/rainbowkit/wallets'
import { DEFAULT_CLAIMER_ADDRESSES, NETWORK, SECONDS_PER_HOUR } from '@shared/utilities'
import { SupportedNetwork, YieldSourceVaultTag } from 'src/types'
import { Address } from 'viem'
import { arbitrumSepolia, base, baseSepolia, mainnet, optimism, optimismSepolia } from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = [
  NETWORK.optimism,
  NETWORK.base,
  NETWORK.optimism_sepolia,
  NETWORK.arbitrum_sepolia,
  NETWORK.base_sepolia
] as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.base]: base,
  [NETWORK.optimism_sepolia]: optimismSepolia,
  [NETWORK.arbitrum_sepolia]: arbitrumSepolia,
  [NETWORK.base_sepolia]: baseSepolia
} as const

/**
 * Wallets
 */
export const WALLETS: { [wallet: string]: CreateWalletFn } = {
  metamask: metaMaskWallet,
  walletconnect: walletConnectWallet,
  rainbow: rainbowWallet,
  injected: injectedWallet,
  argent: argentWallet,
  coinbase: coinbaseWallet,
  ledger: ledgerWallet,
  taho: tahoWallet,
  trust: trustWallet,
  zerion: zerionWallet,
  brave: braveWallet,
  safe: safeWallet,
  xdefi: xdefiWallet,
  uniswap: uniswapWallet,
  coin98: coin98Wallet,
  imtoken: imTokenWallet
}

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [NETWORK.base]: process.env.NEXT_PUBLIC_BASE_RPC_URL,
  [NETWORK.optimism_sepolia]: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC_URL,
  [NETWORK.arbitrum_sepolia]: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL,
  [NETWORK.base_sepolia]: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL
} as const

/**
 * Network config
 */
export const NETWORK_CONFIG: Record<
  SupportedNetwork,
  {
    description: string
    prizePool: Address
    claimer: Address
    lp: { targetAuctionPeriod: number; targetAuctionPriceUsd: number }
    yieldSources: {
      id: string
      name: string
      href: string
      description: string
      vaults: { address: Address; tags?: YieldSourceVaultTag[] }[]
    }[]
  }
> = {
  [NETWORK.optimism]: {
    description: 'The OG optimistic rollup on Ethereum.',
    prizePool: '0xF35fE10ffd0a9672d0095c435fd8767A7fe29B55',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.optimism],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR * 6, targetAuctionPriceUsd: 10 },
    yieldSources: [
      {
        id: 'beefy',
        name: 'Beefy',
        href: 'https://beefy.finance/',
        description: 'Multichain yield optimizer',
        vaults: [
          { address: '0x1dBD083e1422c8c7AcD7091F5437e8C2854F25f4', tags: ['lp'] },
          { address: '0xCC60ebB05b1E327Ccb4F6c297B9404fdD2Ff5fC2', tags: ['lp'] },
          { address: '0x6d5e473D909d2f09DBFfA08E4F64B8d9E3748360', tags: ['stablecoin'] },
          { address: '0xEb0f1cBDac4Ff1BeE4a9806C664f517B099bFbC3', tags: ['stablecoin'] },
          { address: '0x0654BE5e04827e7B999fcE537882270798F57FE9', tags: ['lp'] },
          { address: '0x4a9Bff2f96b441b2E8f7142285B4E708BD18a721', tags: ['lp'] },
          { address: '0xA240fEd2198E2549C090b7b6b3b7748f9330E88a', tags: ['lp'] },
          { address: '0xEcbe6Eef225f143EE4Eb26368a2f6BE1E60835bC', tags: ['lp'] },
          { address: '0xAc314aa0FB72aa53A100AaF55A4CF9d9949FF9c0', tags: ['lp'] },
          { address: '0x60c20e80355e92Ef2f1CD96E07088F1b0AF46124' }
        ]
      }
    ]
  },
  [NETWORK.base]: {
    description: `Coinbase's optimistic rollup on Ethereum.`,
    prizePool: '0x45b2010d8A4f08b53c9fa7544C51dFd9733732cb',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.base],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR * 6, targetAuctionPriceUsd: 10 },
    yieldSources: []
  },
  [NETWORK.optimism_sepolia]: {
    description: 'Sepolia testnet for the Optimism network.',
    prizePool: '0x122FecA66c2b1Ba8Fa9C39E88152592A5496Bc99',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.optimism_sepolia],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR * 6, targetAuctionPriceUsd: 10 },
    yieldSources: [
      {
        id: 'aave',
        name: 'Faux Aave',
        href: 'https://aave.com/',
        description: 'Lending and borrowing protocol',
        vaults: [
          { address: '0x6cDfb8288F5445255F9dfF6782471DE7556fD481', tags: ['stablecoin'] },
          { address: '0x19f8F337C72C430cFDe9EC07D5C51639ad143bd5', tags: ['stablecoin'] },
          { address: '0x14A1EDBB4723AA163A11742Df934C53C43feEC23', tags: ['stablecoin'] },
          { address: '0xaF9Ad81aB225Fe2d24dD2067a38A4CE69Ec07784' },
          { address: '0xDD41e571f0f7614Ae37935538f92589363843266' }
        ]
      }
    ]
  },
  [NETWORK.arbitrum_sepolia]: {
    description: 'Sepolia testnet for the Arbitrum network.',
    prizePool: '0xdBBC646D78Ca1752F2DB6EA76DC467F740f9f816',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.arbitrum_sepolia],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR * 6, targetAuctionPriceUsd: 10 },
    yieldSources: [
      {
        id: 'aave',
        name: 'Faux Aave',
        href: 'https://aave.com/',
        description: 'Lending and borrowing protocol',
        vaults: [
          { address: '0x67d5B5b7912e1E06633cCbF1344215a2Cd6668D7', tags: ['stablecoin'] },
          { address: '0xFB63e2ff4252a14BA3946B978884A163A1ACDf2b', tags: ['stablecoin'] },
          { address: '0x62546aEbd1cadC0A178DCB97757e6BF436048A79' }
        ]
      }
    ]
  },
  [NETWORK.base_sepolia]: {
    description: 'Sepolia testnet for the Base network.',
    prizePool: '0xC90625047f206f525a811a54BbEc05C23E08B58b',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.base_sepolia],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR * 6, targetAuctionPriceUsd: 10 },
    yieldSources: [
      {
        id: 'aave',
        name: 'Faux Aave',
        href: 'https://aave.com/',
        description: 'Lending and borrowing protocol',
        vaults: [
          { address: '0x8D2F084f97E38EB1d630D0C341aC6281E0Dca41C', tags: ['stablecoin'] },
          { address: '0x6787Cb862802a0C422FD89564f5e7b6403347451', tags: ['stablecoin'] },
          { address: '0x61B32C1df62586B6286f866C465bD5aE0b6020dB', tags: ['stablecoin'] },
          { address: '0xe3944bb9129ac6e117a838a4e4b3A97c80b389ED' },
          { address: '0x2755e45642f88b3F2d1E007119d29914CE8D1A99' }
        ]
      }
    ]
  }
}

/**
 * Vault tag display names
 */
export const VAULT_TAGS: Record<YieldSourceVaultTag, string> = {
  stablecoin: 'Stablecoin',
  lp: 'LP Token',
  lst: 'Liquid Staking'
}

/**
 * Local storage keys
 */
export const LOCAL_STORAGE_KEYS = {
  vaultIds: 'vaultIds'
} as const
