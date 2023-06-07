require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, inlineCode } = require('discord.js');

const axios = require('axios');

const rawGitHubLinkNoun = 'https://raw.githubusercontent.com/wen1now/wordlists/master/most_common_nouns.txt';
const rawGitHubLinkAdj = 'https://gist.githubusercontent.com/hugsy/8910dc78d208e40de42deb29e62df913/raw/eec99c5597a73f6a9240cab26965a8609fa0f6ea/english-adjectives.txt';

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

async function GenerateNoun() {
    return new Promise((resolve, reject) => {
        axios.get(rawGitHubLinkNoun)
          .then(response => {
            const data = response.data;
    
            // Extract the lines of text
            const lines = data.split('\n');
    
            // Remove empty lines if any
            const filteredLines = lines.filter(line => line.trim() !== '');
    
            // Generate a random index within the range of the array length
            const randomIndex = Math.floor(Math.random() * filteredLines.length);
    
            // Retrieve the random noun
            const randomNoun = filteredLines[randomIndex];
    
            // Use the random noun as needed
            resolve(randomNoun);
          })
          .catch(error => {
            reject(error);
          });
      });
}

async function GenerateAdj() {
    return new Promise((resolve, reject) => {
        axios.get(rawGitHubLinkAdj)
          .then(response => {
            const data = response.data;
    
            // Extract the lines of text
            const lines = data.split('\n');
    
            // Remove empty lines if any
            const filteredLines = lines.filter(line => line.trim() !== '');
    
            // Generate a random index within the range of the array length
            const randomIndex = Math.floor(Math.random() * filteredLines.length);
    
            // Retrieve the random noun
            const randomAdj = filteredLines[randomIndex];
    
            // Use the random noun as needed
            resolve(randomAdj);
          })
          .catch(error => {
            reject(error);
          });
      });
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName == 'generate') {
        const amount = interaction.options.get('amount').value;

        if (amount < 1 || amount > 99) {
            const errorEmbed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription('Specified amount must be higher than 0 and less than 100!')
            .setColor('Red');

            interaction.reply({ embeds: [errorEmbed] });
        } else if (amount <= 99) {
            try {
                const usernamePromises = [];

                for (let i = 0; i < amount; i++) {
                const adjPromise = GenerateAdj();
                const nounPromise = GenerateNoun();

                const usernamePromise = Promise.all([adjPromise, nounPromise])
                    .then(([adj, noun]) => {
                        const capitalizedAdj = capitalizeFirstLetter(adj);
                        const capitalizedNoun = capitalizeFirstLetter(noun);
                        return capitalizedAdj.concat(capitalizedNoun);
                    })
                    .catch(error => {
                        throw error;
                    });

                usernamePromises.push(usernamePromise);
            }

            const usernames = await Promise.all(usernamePromises);

            const embed = new EmbedBuilder()
                .setTitle("Generated Usernames")
                .setDescription('Usernames generated by the bot.')
                .setColor('Green')
                .addFields({
                    name: 'Usernames',
                    value: usernames.join('\n'),
                    inline: true,
                });
            interaction.user.send({ embeds: [embed] });
            interaction.reply('Check your DMs!');
            } catch (error) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle("Error!")
                    .setDescription(error)
                    .setColor('Red');

                interaction.reply({ embeds: [errorEmbed] });
            }
        }
    }
});

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

client.login(process.env.TOKEN);