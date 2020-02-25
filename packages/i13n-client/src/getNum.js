import {getNum as Num} from 'to-percent-js';
import text from './text';

const getNum = s => Num(text(s));

export default getNum;
