require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'generate',
        description: 'Generates specified amount of usernames.',
        options: [
            {
                name: 'amount',
                description: 'Amount of usernames to generate.',
                type: ApplicationCommandOptionType.Integer,
                required: true,
            }
        ],
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Registering slash commands..");

        await rest.put(
            Routes.applicationGuildCommands(
            process.env.CLIENT_ID,
            process.env.GUILD_ID
            ),
            { body: commands }
        )

        console.log('Slash commands were registered successfully!')
    } catch (error) {
        console.log(error);
    }
})();