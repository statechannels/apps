import _ from 'lodash';
import prettier from 'prettier-bytes';
import React from 'react';
import {remove} from '../../../clients/web3torrent-client';
import {Torrent} from '../../../types';
import './DownloadInfo.scss';
import {ProgressBar} from './progress-bar/ProgressBar';
import {ChannelState} from '../../../clients/payment-channel-client';
import {utils} from 'ethers';
import {ChannelsList} from '../channels-list/ChannelsList';

const bigNumberify = utils.bigNumberify;

export type DownloadInfoProps = {
  torrent: Torrent;
  channelCache: Record<string, ChannelState>;
  mySigningAddress: string;
  closeChannel: (channelId: string) => Promise<ChannelState>;
};

const DownloadInfo: React.FC<DownloadInfoProps> = ({
  torrent,
  channelCache = {},
  mySigningAddress,
  closeChannel
}: DownloadInfoProps) => {
  const myLeechingChannelIds: string[] = Object.keys(channelCache).filter(
    key => channelCache[key].payer === mySigningAddress
  );
  const totalSpent = myLeechingChannelIds
    .map(id => channelCache[id].beneficiaryBalance)
    .reduce((a, b) => bigNumberify(a).add(bigNumberify(b)), bigNumberify(0))
    .toNumber();
  return (
    <>
      <section className="downloadingInfo">
        <ProgressBar
          downloaded={torrent.downloaded}
          length={torrent.length}
          status={torrent.status}
        />
        {!torrent.done ? (
          <button type="button" className="button cancel" onClick={() => remove(torrent.infoHash)}>
            Cancel Download
          </button>
        ) : (
          false
        )}
        <p>
          Total Spent: <span className="total-spent">{totalSpent} wei</span>
        </p>
        <p>
          {torrent.parsedTimeRemaining}.{' '}
          {prettier(torrent.done || !torrent.downloadSpeed ? 0 : torrent.downloadSpeed)}
          /s down, {prettier(!torrent.uploadSpeed ? 0 : torrent.uploadSpeed)}/s up
          <br />
          Connected to <strong>{torrent.numPeers}</strong> peers.
        </p>
      </section>
      <ChannelsList
        wires={torrent.wires}
        channels={_.pickBy(channelCache, ({channelId}) => myLeechingChannelIds.includes(channelId))}
        peerType={'leecher'}
        closeChannel={closeChannel}
      />
    </>
  );
};

export {DownloadInfo};
