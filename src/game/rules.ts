export type Token = {id:number;pos:number};
export type Player = {id:string;username:string;color:string;tokens:Token[]};
export type GameState = {players:Player[];turn:number;dice:number|null;sixes:number;status:'waiting'|'playing'|'finished';winnerId:string|null};
export const STARTS=[0,13,26,39];
export const SAFE_CELLS=new Set([0,8,13,21,26,34,39,47]);
export const PATH_LENGTH=57; // 0..51 shared track, 52..56 home stretch, 57 finished
export const createGame=(players:Pick<Player,'id'|'username'|'color'>[]):GameState=>({players:players.map(p=>({...p,tokens:Array.from({length:4},(_,id)=>({id,pos:-1}))})),turn:0,dice:null,sixes:0,status:players.length>=2?'playing':'waiting',winnerId:null});
export const absoluteCell=(playerIndex:number,pos:number)=>pos>=0&&pos<52?(STARTS[playerIndex]+pos)%52:null;
export const legalTokens=(state:GameState,dice:number):number[]=>{const p=state.players[state.turn];if(!p)return[];return p.tokens.filter(t=>t.pos===-1?dice===6:t.pos<57&&t.pos+dice<=57).map(t=>t.id)};
export function applyMove(state:GameState,playerId:string,tokenId:number,from:number,to:number,dice:number):GameState {
 if(state.status!=='playing'||state.players[state.turn]?.id!==playerId||state.dice!==dice)throw Error('It is not your turn or the dice has changed');
 const pi=state.turn,p=state.players[pi],token=p.tokens.find(t=>t.id===tokenId);if(!token||token.pos!==from)throw Error('Token does not belong to this player or position is stale');
 if(!legalTokens(state,dice).includes(tokenId))throw Error('Illegal token move');const expected=from===-1?0:from+dice;if(to!==expected)throw Error('Move distance does not match dice');
 const players=state.players.map(x=>({...x,tokens:x.tokens.map(t=>({...t}))}));players[pi].tokens[tokenId].pos=to;
 const cell=absoluteCell(pi,to);if(cell!==null&&!SAFE_CELLS.has(cell)){for(let oi=0;oi<players.length;oi++)if(oi!==pi)for(const t of players[oi].tokens){if(absoluteCell(oi,t.pos)===cell)t.pos=-1}}
 const win=players[pi].tokens.every(t=>t.pos===57);const sixes=dice===6?state.sixes:0;const nextTurn=dice===6?pi:(pi+1)%players.length;
 return {...state,players,turn:nextTurn,dice:null,sixes,status:win?'finished':'playing',winnerId:win?playerId:null};
}
