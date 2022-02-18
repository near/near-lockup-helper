import BN from "bn.js";
import { BinaryReader } from "near-api-js/lib/utils/serialize";

import { TransferInformation, VestingInformation } from "../types/types";

export const saturatingSub = (a: BN, b: BN) => {
  const res = a.sub(b);
  return res.gte(new BN(0)) ? res : new BN(0);
};

export const readOption = (reader: BinaryReader): string => {
  const x = reader.readU8();
  return x === 1 ? reader.readU64().toString() : "0";
};

/**
 *
 * @param info {@link VestingInformation}.
 * @returns string | undefined.
 */
export const formatVestingInfo = (
  info: VestingInformation
): string | undefined => {
  if (!info?.start) return undefined; // TODO
  const start = new Date(info.start.divn(1000000).toNumber());
  const cliff = new Date(info.cliff.divn(1000000).toNumber());
  const end = new Date(info.end.divn(1000000).toNumber());
  return `from ${start} until ${end} with cliff at ${cliff}`;
};

/**
 *
 * @param releaseDuration BN.
 * @returns BN.
 */
export const formatReleseDuration = (releaseDuration: BN): BN =>
  releaseDuration.div(new BN("1000000000")).divn(60).divn(60).divn(24);

/**
 *
 * @param lockupDuration
 * @param lockupTimestamp
 * @param hasBrokenTimestamp
 * @returns timestamp.
 */
export const getStartLockupTimestamp = (
  lockupDuration: BN,
  lockupTimestamp: BN,
  hasBrokenTimestamp: boolean
) => {
  const phase2Time = new BN("1602614338293769340");
  const timestamp = BN.max(phase2Time.add(lockupDuration), lockupTimestamp);
  return hasBrokenTimestamp ? phase2Time : timestamp;
};

/**
 *
 * @param reader {@link BinaryReader}.
 * @returns one of {@link VestingInformation} or undefined.
 */
export const getVestingInformation = (
  reader: BinaryReader
): VestingInformation => {
  const vestingType = reader.readU8();
  switch (vestingType) {
    case 1:
      return {
        vestingHash: reader.readArray(() => reader.readU8()),
      };
    case 2:
      return {
        start: reader.readU64(),
        cliff: reader.readU64(),
        end: reader.readU64(),
      };
    case 3:
      return {
        unvestedAmount: reader.readU128(),
        terminationStatus: reader.readU8(),
      };
    default:
      return undefined; // TODO
  }
};

/**
 *
 * @param reader {@link BinaryReader}.
 * @returns one of {@link TransferInformation}.
 */
export const getTransferInformation = (
  reader: BinaryReader
): TransferInformation => {
  const tiType = reader.readU8();
  if (tiType === 0) {
    return {
      transfers_timestamp: reader.readU64(),
    };
  } else {
    return {
      transfer_poll_account_id: reader.readString(),
    };
  }
};
