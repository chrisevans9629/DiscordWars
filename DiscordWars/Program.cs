using System;
using System.Reflection;
using System.Threading.Tasks;
using Discord;
using Discord.Commands;
using Discord.WebSocket;

namespace DiscordWars
{
    public class InfoModule : ModuleBase<SocketCommandContext>
    {
        [Command("say")]
        [Summary("Echoes a message.")]
        public Task SayAsync([Remainder] [Summary("The text to echo")] string echo)
            => ReplyAsync(echo);

        [Command("join")]
        public Task JoinAsync(SocketUser user)
        {
            return ReplyAsync($"User {user.Username} joined!" );
        }


        public Task MoveAsync([Remainder] [Summary("move action")] string action)
        {
            return ReplyAsync($"");
        }

    }



    public class CommandHandler
    {
        private readonly DiscordSocketClient _client;
        private readonly CommandService _commands;

        public CommandHandler(DiscordSocketClient client, CommandService commands)
        {
            _commands = commands;
            _client = client;
        }

        public async Task InstallCommandsAsync()
        {
            // Hook the MessageReceived event into our command handler
            _client.MessageReceived += HandleCommandAsync;

            // Here we discover all of the command modules in the entry 
            // assembly and load them. Starting from Discord.NET 2.0, a
            // service provider is required to be passed into the
            // module registration method to inject the 
            // required dependencies.
            //
            // If you do not use Dependency Injection, pass null.
            // See Dependency Injection guide for more information.
            await _commands.AddModulesAsync(assembly: Assembly.GetEntryAssembly(),
                                            services: null);
        }

        private async Task HandleCommandAsync(SocketMessage messageParam)
        {
            // Don't process the command if it was a system message
            var message = messageParam as SocketUserMessage;
            if (message == null) return;

            // Create a number to track where the prefix ends and the command begins
            int argPos = 0;

            // Determine if the message is a command based on the prefix and make sure no bots trigger commands
            if (!(message.HasCharPrefix('!', ref argPos) ||
                message.HasMentionPrefix(_client.CurrentUser, ref argPos)) ||
                message.Author.IsBot)
                return;

            // Create a WebSocket-based command context based on the message
            var context = new SocketCommandContext(_client, message);

            // Execute the command with the command context we just
            // created, along with the service provider for precondition checks.

            // Keep in mind that result does not indicate a return value
            // rather an object stating if the command executed successfully.
            var result = await _commands.ExecuteAsync(
                context: context,
                argPos: argPos,
                services: null);

            // Optionally, we may inform the user if the command fails
            // to be executed; however, this may not always be desired,
            // as it may clog up the request queue should a user spam a
            // command.
            // if (!result.IsSuccess)
            // await context.Channel.SendMessageAsync(result.ErrorReason);
        }
    }




    class Program
    {
        private static DiscordSocketClient _client;

        static async Task Main(string[] args)
        {
			_client = new DiscordSocketClient();

            _client.Log += Log;

            // Remember to keep token private or to read it from an 
            // external source! In this case, we are reading the token 
            // from an environment variable. If you do not know how to set-up
            // environment variables, you may find more information on the 
            // Internet or by using other methods such as reading from 
            // a configuration.
            await _client.LoginAsync(TokenType.Bot,
                "NzExMzYwMTM4MzcxMzk5NzMx.XsB9wg.vDGJ4r9sy7dbOhWUFshq0Po5XwI");
            await _client.StartAsync();
            
            var handler = new CommandHandler(_client, new CommandService(new CommandServiceConfig()));
            await handler.InstallCommandsAsync();
            //_client.MessageReceived += ClientOnMessageReceived;
            // Block this task until the program is closed.
            await Task.Delay(-1);
		}

        private static async Task ClientOnMessageReceived(SocketMessage arg)
        {
            if (arg.Content == "!ping")
            {
                await arg.Channel.SendMessageAsync("Pong!" + $" @{arg.Author.Username}");
            }
        }

        private static async Task Log(LogMessage arg)
        {
            Console.WriteLine(arg.ToString());
        }
    }
}
