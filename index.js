import Plugin from '@structures/plugin';

import { getByProps } from '@webpack';
import Commands from '@api/commands';

const [
   Channels,
   Unreads,
   Messages
] = getByProps(
   ['getDMFromUserId'],
   ['ack', 'ackCategory'],
   ['hasUnread', 'lastMessageId'],
   { bulk: true }
);

export default class MarkAllRead extends Plugin {
   start() {
      Commands.register({
         command: 'read',
         description: 'Marks all channels as read.',
         execute: async () => {
            const channels = Object.keys(Channels.getMutableGuildAndPrivateChannels());

            const unreads = channels.map(c => ({
               channelId: c,
               messageId: Messages.lastMessageId(c)
            }));

            return await Unreads.bulkAck(unreads);
         }
      });
   }

   stop() {
      Commands.unregister('read');
   }
}