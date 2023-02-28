import {BigNumber} from 'ethers';
import {prettyPrintAttoFil, prettyPrintWei} from './calculateWei';

describe('Pretty printing wei', () => {
  it.each`
    input         | output
    ${18}         | ${'18.0 wei'}
    ${1001}       | ${'1.0 kwei'}
    ${1599}       | ${'1.6 kwei'}
    ${1234567}    | ${'1.2 Mwei'}
    ${12345678}   | ${'12.3 Mwei'}
    ${123456789}  | ${'123.5 Mwei'}
    ${1234567890} | ${'1.2 Gwei'}
  `('prettyPrintWei(bigNumberify($input)) = $output', ({input, output}) => {
    expect(prettyPrintWei(BigNumber.from(input))).toEqual(output);
  });
});

describe('Pretty printing attoFIL', () => {
  it.each`
    input         | output
    ${18}         | ${'18.0 attoFIL'}
    ${1001}       | ${'1.0 femtoFIL'}
    ${1599}       | ${'1.6 femtoFIL'}
    ${1234567}    | ${'1.2 picoFIL'}
    ${12345678}   | ${'12.3 picoFIL'}
    ${123456789}  | ${'123.5 picoFIL'}
    ${1234567890} | ${'1.2 nanoFIL'}
  `('prettyPrintAttoFIL(bigNumberify($input)) = $output', ({input, output}) => {
    expect(prettyPrintAttoFIL(BigNumber.from(input))).toEqual(output);
  });
});
