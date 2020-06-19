export interface IMessage {
  author: {
    username: string;
    avatarURL(): string;
  };
  reply(msg: string): void;
  content: string;
}
