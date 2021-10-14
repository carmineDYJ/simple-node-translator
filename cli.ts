import * as commander from 'commander';

const program = new commander.Command();

program.version('0.0.1')
  .name('n-tr')
  .usage('<english-word>');

program.parse(process.argv);