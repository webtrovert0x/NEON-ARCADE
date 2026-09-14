export const baseAccount = () => ({});
export const getOrCreateSubscriptionOwnerWallet = () => ({});
export const toEvmSmartAccount = () => ({});
export const toEvmDelegatedAccount = () => ({});
export const exact = {};
export const upto = {};
export const client = {};
export const exactClient = () => ({});
export const uptoClient = () => ({});
export const toClientEvmSigner = () => ({});
export const toEvmSigner = () => ({});
export const createX402Client = () => ({});

const fallback = {
  baseAccount,
  getOrCreateSubscriptionOwnerWallet,
  toEvmSmartAccount,
  toEvmDelegatedAccount,
  exact,
  upto,
  client,
  toClientEvmSigner,
};

export default fallback;
