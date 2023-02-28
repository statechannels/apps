import {BigNumber} from 'ethers';
import prettier from 'prettier-bytes';
import {WEI_PER_BYTE} from '../constants';
import bigDecimal from 'js-big-decimal';

export const calculateWei = (fileSize: number | string) => {
  if (!isNaN(Number(fileSize))) {
    return WEI_PER_BYTE.mul(fileSize);
  } else return BigNumber.from(NaN);
};

export const prettyPrintBytes = (wei: BigNumber): string => {
  const bytes = wei.div(WEI_PER_BYTE);
  return prettier(bytes.toNumber());
};

export const prettyPrintWei = (wei: BigNumber): string => {
  const PRECISION = 1;
  const names = ['attoTFIL', 'femtoTFIL', 'picoTFIL', 'nanoTFIL', 'microTFIL', 'milliTFIL', 'TFIL'];
  const decimals = [0, 3, 6, 9, 12, 15, 18];

  if (!wei) {
    return 'unknown';
  } else if (wei.eq(BigNumber.from(0))) {
    return '0 attoTFIL';
  } else {
    let formattedString;
    decimals.forEach((decimal, index) => {
      if (wei.gte(BigNumber.from(10).pow(decimal))) {
        formattedString =
          bigDecimal.divide(wei.toString(), BigNumber.from(10).pow(decimal), PRECISION) +
          ' ' +
          names[index];
      }
    });
    return formattedString;
  }
};

// 1 wei is equivalent to 1 attoFil
export const prettyPrintAttoFIL = (amount: BigNumber): string => {
  const PRECISION = 1;
  const names = ['attoFIL', 'femtoFIL', 'picoFIL', 'nanoFIL', 'microFIL', 'milliFIL', 'FIL'];
  const decimals = [0, 3, 6, 9, 12, 15, 18];

  if (!amount) {
    return 'unknown';
  } else if (amount.eq(BigNumber.from(0))) {
    return '0 wei';
  } else {
    let formattedString;
    decimals.forEach((decimal, index) => {
      if (amount.gte(BigNumber.from(10).pow(decimal))) {
        formattedString =
          bigDecimal.divide(amount.toString(), BigNumber.from(10).pow(decimal), PRECISION) +
          ' ' +
          names[index];
      }
    });
    return formattedString;
  }
};
