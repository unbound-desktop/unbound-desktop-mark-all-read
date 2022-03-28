import Plugin from '@structures/plugin';

import { getByProps } from '@webpack';
import Commands from '@api/commands';

export default class MarkAllRead extends Plugin {
   start() {
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


      Commands.register({
         command: 'read',
         description: 'Marks all channels as read.',
         execute: async () => {
            const mutable = Channels.getMutableGuildAndPrivateChannels();
            const channels = Object.keys(mutable);

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