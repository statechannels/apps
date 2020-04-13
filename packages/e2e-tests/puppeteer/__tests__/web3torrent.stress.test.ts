/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable jest/expect-expect */
import {Page, Browser} from 'puppeteer';
import {configureEnvVariables, getEnvBool} from '@statechannels/devtools';

import {setUpBrowser, loadDapp, waitAndOpenChannel, waitForClosingChannel} from '../helpers';

import {uploadFile, startDownload, cancelDownload} from '../scripts/web3torrent';

configureEnvVariables();
const HEADLESS = getEnvBool('HEADLESS');
jest.setTimeout(HEADLESS ? 200_000 : 1_000_000);

const USES_VIRTUAL_FUNDING = true;

const enum Label {
  A = 'A',
  B = 'B'
  // C = 'C',
  // D = 'D'
}

const labels: Label[] = [Label.A, Label.B];
type Data<T> = Record<Label, T>;

const assignEachLabel = <T>(data: Data<T>, cb: (label: Label) => any) =>
  Promise.all(labels.map(async label => (data[label] = await cb(label))));

const forEach = async <T>(data: Data<T>, cb: (obj: T, label: Label) => any) =>
  await Promise.all(labels.map(async label => await cb(data[label], label)));

describe('Supports torrenting among peers with channels', () => {
  const browsers: Data<Browser> = {} as Data<Browser>;
  const tabs: Data<Page> = {} as Data<Page>;
  afterAll(async () => {
    if (HEADLESS) {
      await forEach(browsers, async browser => browser && (await browser.close()));
    }
  });

  it('allows peers to start torrenting', async () => {
    // 100ms sloMo avoids some undiagnosed race conditions

    console.log('Opening browsers');
    await assignEachLabel(browsers, async () => await setUpBrowser(HEADLESS, 100));

    console.log('Waiting on pages');
    await assignEachLabel(tabs, async label => (await browsers[label].pages())[0]);

    const logPageOutput = (role: Label) => (msg: any) =>
      // use console.error so we can redirect STDERR to a file
      console.error(`${role}: `, msg.text());
    forEach(tabs, (tab, label) => tab.on('console', logPageOutput(label)));

    console.log('Loading dapps');
    await forEach(tabs, async (tab, label) => {
      await loadDapp(tab, 0, true);
      console.log(`${label} dapp loaded`);
    });

    await tabs.A.goto('http://localhost:3000/file/new', {waitUntil: 'load'});

    console.log('A uploads a file');
    const url = await uploadFile(tabs.A, USES_VIRTUAL_FUNDING);

    console.log('B starts downloading...');
    await startDownload(tabs.B, url, USES_VIRTUAL_FUNDING);

    console.log('Waiting for open channels');
    await forEach(tabs, waitAndOpenChannel(USES_VIRTUAL_FUNDING));

    // Let the download cointinue for some time
    console.log('Downloading');
    await tabs.B.waitFor(1000);

    console.log('B cancels download');
    await cancelDownload(tabs.B);

    console.log('Waiting for channels to close');
    await forEach(tabs, waitForClosingChannel);
  });
});
