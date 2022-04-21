import BN from "bn.js";
import { ConnectConfig } from "near-api-js/lib/connect";
import { KeyStore } from "near-api-js/lib/key_stores/keystore";
import { QueryResponseKind } from "near-api-js/lib/providers/provider";

export type LockupState = {
  readonly owner: string;
  readonly lockupAmount: BN;
  readonly terminationWithdrawnTokens: BN;
  readonly lockupDuration: BN;
  readonly releaseDuration?: BN;
  readonly lockupTimestamp?: BN;
  readonly blockTimestamp: BN;
  readonly transferInformation: TransferInformation;
  readonly vestingInformation?: VestingInformation;
  readonly hasBrokenTimestamp: boolean;
};

export type AccountLockup = {
  readonly lockupAccountId: string;
  readonly calculatedAtBlockHeight: number;
  readonly ownerAccountBalance: BN;
  readonly lockedAmount: BN;
  readonly liquidAmount: BN;
  readonly totalAmount: BN;
  readonly lockupReleaseStartDate: Date;
  readonly lockupState: LockupState & {
    readonly vestedInfo: string;
  };
};

export type TransferInformation = {
  readonly transfers_timestamp?: BN;
  readonly transfer_poll_account_id?: string;
};

export type VestingInformation = {
  readonly vestingHash?: readonly unknown[];
  readonly start?: BN;
  readonly cliff?: BN;
  readonly end?: BN;
  readonly unvestedAmount?: BN;
  readonly terminationStatus?: number;
};

type StateItem = {
  readonly key: string;
  readonly value: string;
  readonly proof: readonly string[];
}

export type BlockReference = {
  readonly block_id: string | number;
} | {
  readonly finality: "optimistic" | "near-final" | "final";
} | {
  readonly sync_checkpoint: "genesis" | "earliest_available";
};

export type ViewStateResult = QueryResponseKind & {
  readonly values: readonly StateItem[];
  readonly proof: readonly string[];
};

export type ViewAccountQuery = QueryResponseKind & {
  readonly amount: string;
  readonly locked: string;
  readonly code_hash: string;
  readonly storage_usage: number;
  readonly storage_paid_at: number;
};

export type ViewAccount = {
  readonly amount: string;
  readonly codeHash: string;
  readonly blockHeight: number;
};

export type ConnectOptions = Omit<ConnectConfig, "networkId" | "keyStore" | "headers"> & {
  readonly networkId?: string;
  readonly keyStore?: KeyStore;
  readonly headers?: {
    readonly [key: string]: string | number;
  }
};
