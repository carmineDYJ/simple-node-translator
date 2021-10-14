#!/usr/bin/env node

import * as commander from 'commander';
import {translate} from './main';

const program = new commander.Command();

program.version('0.0.1')
  .name('n-fy')
  .usage('<english_word>')
  .arguments('<english_word>')
  .action(function (englishWord: string){
    translate(englishWord);
  });

program.parse(process.argv);