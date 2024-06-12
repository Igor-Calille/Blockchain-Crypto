import ranges from './ranges.js';
import encontrarBitcoins from './bitcoin-find.js';
import readline from 'readline';
import chalk from 'chalk';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let key = 0;
let min, max = 0;

console.clear();

console.log("\x1b[38;2;250;128;114m" + "╔════════════════════════════════════════════════════════╗\n" +
            "║" + "\x1b[0m" + "\x1b[36m" + "   ____ _____ ____   _____ ___ _   _ ____  _____ ____   " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
            "║" + "\x1b[0m" + "\x1b[36m" + "  | __ )_   _/ ___| |  ___|_ _| \\ | |  _ \\| ____|  _ \\  " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
            "║" + "\x1b[0m" + "\x1b[36m" + "  |  _ \\ | || |     | |_   | ||  \\| | | | |  _| | |_) | " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
            "║" + "\x1b[0m" + "\x1b[36m" + "  | |_) || || |___  |  _|  | || |\\  | |_| | |___|  _ <  " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
            "║" + "\x1b[0m" + "\x1b[36m" + "  |____/ |_| \\____| |_|   |___|_| \\_|____/|_____|_| \\_\\ " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
            "║" + "\x1b[0m" + "\x1b[36m" + "                                                        " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
            "╚══════════════════════\x1b[32m" + "Investidor Internacional - v0.3c" + "\x1b[0m\x1b[38;2;250;128;114m═    ═╝" + "\x1b[0m");

rl.question(`Escolha uma carteira puzzle( ${chalk.cyan(1)} - ${chalk.cyan(160)}): `, (answer) => {
    if (parseInt(answer) < 1 || parseInt(answer) > 160) {
        console.log(chalk.bgRed('Erro: você precisa escolher um número entre 1 e 160'));
    }

    min = ranges[answer-1].min;
    max = ranges[answer-1].max;
    console.log('Carteira escolhida: ', chalk.cyan(answer), ' Min: ', chalk.yellow(min), ' Max: ', chalk.yellow(max));
    console.log('Número possível de chaves:', chalk.yellow(parseInt(BigInt(max) - BigInt(min)).toLocaleString('pt-BR')));
    key = BigInt(min);

    rl.question(`Escolha uma opção (${chalk.cyan(1)} - Começar do início, ${chalk.cyan(2)} - Escolher uma porcentagem, ${chalk.cyan(3)} - Escolher mínimo): `, (answer2) => {
        if (answer2 == '2') {
            rl.question('Escolha um número entre 0 e 1: ', (answer3) => {
                if (parseFloat(answer3) > 1 || parseFloat(answer3) < 0) {
                    console.log(chalk.bgRed('Erro: você precisa escolher um número entre 0 e 1'));
                    throw 'Número inválido';
                }

                const range = BigInt(max) - BigInt(min);
                const percentualRange = range * BigInt(Math.floor(parseFloat(answer3) * 1e18)) / BigInt(1e18);
                min = BigInt(min) + BigInt(percentualRange);
                console.log('Começando em: ', chalk.yellow('0x' + min.toString(16)));
                key = BigInt(min);
                encontrarBitcoins(key, min, max);
                rl.close();
            });
        } else if (answer2 == '3') {
            rl.question('Entre o mínimo: ', (answer3) => {
                min = BigInt(answer3);
                key = BigInt(min);
                encontrarBitcoins(key, min, max);
                rl.close();
            });
        } else {
            min = BigInt(min);
            encontrarBitcoins(key, min, max);
            rl.close();
        }
    });
});

rl.on('SIGINT', () => {
    rl.close();
    process.exit();
});

process.on('SIGINT', () => {
    console.log(chalk.yellow('\nDesligando graciosamente a partir de SIGINT (Ctrl+C)'));
    rl.close();
    process.exit();
});
