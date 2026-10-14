import {PROFILES,SIZES,rarityForSize,compareFish} from './fish-profiles.mjs';
export {compareFish};
const names=[
['コイ','ニシキゴイ','フナ','キンギョ','メダカ','ドジョウ','ナマズ','ブラックバス','ブルーギル','ライギョ','タナゴ','モツゴ','オイカワ','ウグイ','カワムツ','ヌマムツ','ヨシノボリ','カマツカ','ニゴイ','ソウギョ','ハクレン','アオウオ','ワカサギ','イトモロコ','スゴモロコ','ヒガイ','ゼゼラ','ツチフキ','ギンブナ','ヘラブナ','オオクチバス','タイワンドジョウ','コウタイ','チョウザメ'],
['マアジ','マサバ','マイワシ','カタクチイワシ','サンマ','マダイ','クロダイ','スズキ','ヒラメ','マコガレイ','マグロ','カツオ','ブリ','カンパチ','ヒラマサ','メバル','カサゴ','ハタ','アイナメ','キス','ボラ','サヨリ','トビウオ','シイラ','タチウオ','ウマヅラハギ','カワハギ','ハリセンボン','マンボウ','アオリイカ','タコ','シュモクザメ','リュウグウノツカイ'],
['アユ','イワナ','ヤマメ','アマゴ','ニジマス','サクラマス','サケ','イトウ','ブラウントラウト','ブルックトラウト','カジカ','アカザ','アブラハヤ','タカハヤ','ムギツク','シマドジョウ','ホトケドジョウ','アジメドジョウ','ウナギ','テナガエビ','サワガニ','カワアナゴ','ボウズハゼ','ヌマチチブ','カワヨシノボリ','トウヨシノボリ','スナヤツメ','ネコギギ','アユカケ','ビワマス','オショロコマ','ゴギ','カラフトマス']];
export const FISH=names.flatMap((a,scene)=>a.map((name,i)=>{
 const [min,max]=SIZES[name];const rarity=rarityForSize(max);
 return {id:scene*34+i,name,scene,rarity,min,max,points:[35,70,160,420,1200][rarity],shape:PROFILES[name].family,visual:PROFILES[name]};
}));
export const SCENES=[{name:'森の池',en:'FOREST POND',desc:'木漏れ日の下で、のんびりと。'},{name:'海',en:'QUIET OCEAN',desc:'水平線の向こうから、大物の予感。'},{name:'川',en:'RIVER STREAM',desc:'流れに耳をすませて、ひと休み。'}];
export const RARITIES=['コモン','アンコモン','レア','エピック','レジェンド'];
export const SHOP=[
{id:'head-none',category:'head',value:'none',name:'そのまま',price:0},
{id:'head-cat',category:'head',value:'cat',name:'猫耳',price:120},
{id:'head-robot',category:'head',value:'robot',name:'ロボットヘッド',price:350},
{id:'head-hat',category:'head',value:'hat',name:'釣り人の帽子',price:180},
{id:'head-crown',category:'head',value:'crown',name:'小さな王冠',price:700},
{id:'head-bunny',category:'head',value:'bunny',name:'うさぎ耳',price:220},
{id:'body-basic',category:'body',value:'basic',name:'ベーシック',price:0},
{id:'body-suit',category:'body',value:'suit',name:'宇宙のスーツ',price:300},
{id:'body-robot',category:'body',value:'robot',name:'メカボディ',price:450},
{id:'body-stripe',category:'body',value:'stripe',name:'ボーダーシャツ',price:160},
{id:'feet-basic',category:'feet',value:'basic',name:'シンプルシューズ',price:0},
{id:'feet-boots',category:'feet',value:'boots',name:'レインブーツ',price:150},
{id:'feet-robot',category:'feet',value:'robot',name:'メカシューズ',price:260},
{id:'decor-plant',category:'decor',value:'plant',name:'ゆらゆら水草',price:180},
{id:'decor-rock',category:'decor',value:'rock',name:'まるい岩',price:220},
{id:'decor-castle',category:'decor',value:'castle',name:'小さなお城',price:500},
{id:'decor-bubbles',category:'decor',value:'bubbles',name:'バブルメーカー',price:260},
{id:'decor-pebbles',category:'decor',value:'pebbles',name:'磨かれた川砂利',price:60},
{id:'decor-shells',category:'decor',value:'shells',name:'貝殻の小径',price:90},
{id:'decor-moss',category:'decor',value:'moss',name:'苔むした石',price:420},
{id:'decor-driftwood',category:'decor',value:'driftwood',name:'時を刻む流木',price:850},
{id:'decor-fern',category:'decor',value:'fern',name:'ミクロソリウムの茂み',price:1200},
{id:'decor-cave',category:'decor',value:'cave',name:'玄武岩の洞窟',price:2400},
{id:'decor-ruins',category:'decor',value:'ruins',name:'沈んだ石柱',price:4800},
{id:'decor-shipwreck',category:'decor',value:'shipwreck',name:'古い沈没船',price:12000},
{id:'decor-atlantis',category:'decor',value:'atlantis',name:'海底宮殿アトランティス',price:1000000}];
