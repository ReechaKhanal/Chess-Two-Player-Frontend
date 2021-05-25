import pawn from './pawn.png';
import blackPawn from './black_pawn.png';
import rook from './rook.png';
import blackRook from './black_rook.png';
import knight from './knight.png';
import blackKnight from './black_knight.png';
import bishop from './bishop.png';
import blackBishop from './black_bishop.png';
import queen from './queen.png';
import blackQueen from './black_queen.png';
import king from './king.png';
import blackKing from './black_king.png';
import empty from './empty.svg';
import empty1 from './download.jpg';

export function getImageType(value){
    var dict = {
        1: pawn,
        4: bishop,
        5: knight,
        6: rook,
        7: queen,
        8: king,
    };
    var src1 = blackPawn;
    if (value === -4){
        src1 = blackBishop;
    } else if (value === -5){
        src1 = blackKnight;
    } else if (value === -6){
        src1 = blackRook;
    } else if (value === -7){
        src1 = blackQueen;
    } else if (value === -8){
        src1 = blackKing;
    } else if (value === 0){
        src1 = empty;
    } else if (value === -1){
        src1 = blackPawn;
    } else {
        src1 = dict[value]
    }
    return src1
}