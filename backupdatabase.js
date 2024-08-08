const { Client, Intents, MessageEmbed } = require('discord.js');
const fs = require('fs');
const archiver = require('archiver');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const TOKEN = ''; // Ganti dengan token bot Discord Anda
const CHANNEL_ID = '1254416405919563867';   // Ganti dengan ID saluran Discord Anda
const FOLDER_PATH = 'C:\\xampp\\mysql\\data\\vexcity'; // Ganti dengan path folder yang sesuai
const ARCHIVE_PATH = 'vexcity.zip'; // Nama file archive

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.content === '!backupdatabase') {
        try {
            // Membuat file .zip dari folder
            await createArchive(FOLDER_PATH, ARCHIVE_PATH);

            // Mengirim file dan embed ke saluran Discord
            const channel = await client.channels.fetch(CHANNEL_ID);
            if (channel) {
                // Mengirim file dengan embed
                const embed = new MessageEmbed()
                    .setTitle('**__VEXCITY DATABASE BACKUP__**')
                    .setDescription('Anda berhasil backup database dengan nama vexcity.sql menjadi vexcity.zip dan menjadi terpisah, Terima Kasih telah menggunakan bot backup ini')
                    .setColor('#FF0000')
                    .setImage('https://cdn.discordapp.com/attachments/1243018041743245424/1270672483967696936/download_1.jpg')
                    .setFooter('VC-RP | DATABASE');

                await channel.send({
                    embeds: [embed],
                    files: [ARCHIVE_PATH]
                });
                console.log('File sent successfully');
            } else {
                console.error('Channel not found');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }
});

function createArchive(sourceDir, outPath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`${archive.pointer()} total bytes`);
            console.log('Archiver has been finalized and the output file descriptor has closed.');
            resolve();
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);
        archive.directory(sourceDir, false);
        archive.finalize();
    });
}

client.login(TOKEN);
