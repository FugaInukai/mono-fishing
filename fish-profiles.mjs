// Body proportions and palettes are drawn from photographic reference families.
const groups=[
 ['carp','コイ ニシキゴイ フナ キンギョ ニゴイ ソウギョ ハクレン アオウオ ギンブナ ヘラブナ',.43,'#586446','#b89b56','#eee1b2','#a78247','scales'],
 ['minnow','メダカ タナゴ モツゴ オイカワ ウグイ カワムツ ヌマムツ カマツカ ワカサギ イトモロコ スゴモロコ ヒガイ ゼゼラ ツチフキ アブラハヤ タカハヤ ムギツク アユ',.22,'#53715f','#afc5b5','#edf0d6','#b4bea0','silver'],
 ['loach','ドジョウ シマドジョウ ホトケドジョウ アジメドジョウ',.16,'#635d37','#b7a66a','#ece1b4','#a59766','mottle'],
 ['catfish','ナマズ アカザ ネコギギ',.29,'#404838','#7c8060','#d7d6ab','#6b745a','smooth'],
 ['bass','ブラックバス オオクチバス ライギョ タイワンドジョウ コウタイ',.37,'#384d32','#84925b','#dfe2b3','#6f7d49','stripe'],
 ['bluegill','ブルーギル',.62,'#384e45','#7f9160','#e3c588','#8c945e','bars'],
 ['goby','ヨシノボリ カワアナゴ ボウズハゼ ヌマチチブ カワヨシノボリ トウヨシノボリ',.27,'#565a40','#9c9270','#ddd1a4','#a6a17c','mottle'],
 ['sturgeon','チョウザメ',.25,'#384c4b','#869c96','#d4d9cb','#6e857c','armor'],
 ['trout','イワナ ヤマメ アマゴ ニジマス イトウ ブラウントラウト ブルックトラウト オショロコマ ゴギ',.31,'#3c6353','#aac1a0','#e9e5cb','#a89768','spots'],
 ['salmon','サクラマス サケ ビワマス カラフトマス',.32,'#365768','#a6bbbf','#e3e8df','#798c87','spots'],
 ['sculpin','カジカ アユカケ',.36,'#4d513a','#a39369','#d2c6a0','#a6a17d','mottle'],
 ['eel','ウナギ スナヤツメ',.13,'#293d35','#6c805b','#d3cf9e','#707f57','smooth'],
 ['mackerel','マサバ',.30,'#184e61','#8ab3b6','#e0eeeb','#658a88','waves'],
 ['silver','マアジ マイワシ カタクチイワシ キス ボラ',.26,'#32616e','#a9c5c8','#f0f3e7','#849ca0','silver'],
 ['needle','サンマ サヨリ トビウオ',.14,'#244e67','#91b5c5','#e1ebec','#7a9fac','silver'],
 ['bream','マダイ クロダイ',.50,'#935352','#d48f84','#f0d8c2','#ab7665','scales'],
 ['seabass','スズキ ブリ カンパチ ヒラマサ',.33,'#304e53','#92abb1','#dde7de','#819a87','silver'],
 ['flatfish','ヒラメ マコガレイ',.53,'#5d5940','#9f9672','#d4c6a3','#88805a','mottle'],
 ['tuna','マグロ カツオ',.38,'#193b60','#749bb7','#e1e8e5','#cab762','silver'],
 ['rockfish','メバル カサゴ ハタ アイナメ',.43,'#624f3a','#b69262','#e6d0a3','#a67c4b','mottle'],
 ['mahi','シイラ',.38,'#126a68','#83bb52','#eee283','#619b5d','spots'],
 ['ribbon','タチウオ',.10,'#738d9e','#cfdee8','#fbfbf5','#a3bbc6','silver'],
 ['trigger','ウマヅラハギ カワハギ',.54,'#575949','#aaa187','#e4dfc7','#a9a48a','mottle'],
 ['puffer','ハリセンボン',.64,'#75613e','#c6b477','#f1e7c3','#a4a080','spots'],
 ['sunfish','マンボウ',.80,'#52626b','#9fb2b5','#dbe1d6','#8c9da0','smooth'],
 ['squid','アオリイカ',.35,'#885f46','#bf9a6a','#e9d2ae','#a37d55','mottle'],
 ['octopus','タコ',.47,'#874b40','#b8775a','#dfb492','#a95d45','mottle'],
 ['shrimp','テナガエビ',.25,'#677154','#a1ac89','#d6dab4','#93a080','smooth'],
 ['crab','サワガニ',.65,'#7e392a','#c25d3d','#e7b07f','#a64b32','smooth'],
 ['hammerhead','シュモクザメ',.23,'#3e5862','#8ea3aa','#e0e5da','#708b93','smooth'],
 ['oarfish','リュウグウノツカイ',.11,'#8998a4','#cad8db','#f4f1e4','#b53d43','silver']
];
const profiles=Object.fromEntries(groups.flatMap(([family,names,height,back,side,belly,fin,pattern])=>names.split(' ').map(name=>[name,{family,height,back,side,belly,fin,pattern}])));
Object.assign(profiles['ニシキゴイ'],{back:'#eee8d7',side:'#faf5e3',belly:'#fff9e7',fin:'#e5d4b4',pattern:'koi'});
Object.assign(profiles['キンギョ'],{height:.55,back:'#b7511a',side:'#f69532',belly:'#ffddb0',fin:'#ee963c'});
for(const name of ['フナ','ギンブナ','ヘラブナ'])Object.assign(profiles[name],{height:.47,back:'#515a48',side:'#a6ad91',belly:'#e2e4c9',fin:'#7c8465'});
Object.assign(profiles['タナゴ'],{height:.38,side:'#99b2c5',fin:'#da9177'});
Object.assign(profiles['オイカワ'],{side:'#7cacb1',pattern:'bars',fin:'#bfa585'});
Object.assign(profiles['ニジマス'],{side:'#c2cbd0',pattern:'rainbow'});
Object.assign(profiles['ヤマメ'],{pattern:'parr'});Object.assign(profiles['アマゴ'],{pattern:'parr'});
Object.assign(profiles['イワナ'],{side:'#7d9274',pattern:'lightspots'});Object.assign(profiles['オショロコマ'],{pattern:'lightspots'});
Object.assign(profiles['ブラウントラウト'],{side:'#c2a976',belly:'#eee0ac'});
Object.assign(profiles['クロダイ'],{back:'#394748',side:'#9faead',belly:'#e3e6dd',fin:'#84918d'});
Object.assign(profiles['カサゴ'],{side:'#bc705a',fin:'#ae6a53'});
Object.assign(profiles['カツオ'],{pattern:'bellylines'});
Object.assign(profiles['カンパチ'],{pattern:'yellowline'});Object.assign(profiles['ヒラマサ'],{pattern:'yellowline'});Object.assign(profiles['ブリ'],{pattern:'yellowline'});
Object.assign(profiles['メダカ'],{height:.18,back:'#a4966b',side:'#d4c8a4',fin:'#d9d9bf'});
export const PROFILES=profiles;
export const SIZES={
 'コイ':[25,105],'ニシキゴイ':[20,95],'フナ':[8,40],'キンギョ':[4,28],'メダカ':[1.8,4],'ドジョウ':[7,22],'ナマズ':[25,120],'ブラックバス':[18,65],'ブルーギル':[8,30],'ライギョ':[30,110],'タナゴ':[3,9],'モツゴ':[3,11],'オイカワ':[6,18],'ウグイ':[10,45],'カワムツ':[5,22],'ヌマムツ':[5,18],'ヨシノボリ':[2,8],'カマツカ':[7,23],'ニゴイ':[20,70],'ソウギョ':[40,140],'ハクレン':[40,130],'アオウオ':[50,160],'ワカサギ':[5,15],'イトモロコ':[3,8],'スゴモロコ':[4,13],'ヒガイ':[6,20],'ゼゼラ':[3,7],'ツチフキ':[4,12],'ギンブナ':[8,35],'ヘラブナ':[15,50],'オオクチバス':[20,72],'タイワンドジョウ':[25,85],'コウタイ':[15,50],'チョウザメ':[80,250],
 'マアジ':[10,45],'マサバ':[20,55],'マイワシ':[7,25],'カタクチイワシ':[4,15],'サンマ':[18,40],'マダイ':[20,100],'クロダイ':[15,65],'スズキ':[30,120],'ヒラメ':[25,110],'マコガレイ':[15,50],'マグロ':[100,320],'カツオ':[35,100],'ブリ':[40,150],'カンパチ':[50,190],'ヒラマサ':[50,220],'メバル':[10,35],'カサゴ':[10,40],'ハタ':[30,160],'アイナメ':[15,65],'キス':[8,35],'ボラ':[15,85],'サヨリ':[15,45],'トビウオ':[15,40],'シイラ':[50,210],'タチウオ':[40,200],'ウマヅラハギ':[15,40],'カワハギ':[10,35],'ハリセンボン':[10,70],'マンボウ':[80,330],'アオリイカ':[15,55],'タコ':[15,100],'シュモクザメ':[120,450],'リュウグウノツカイ':[250,800],
 'アユ':[7,30],'イワナ':[10,60],'ヤマメ':[8,40],'アマゴ':[8,40],'ニジマス':[15,100],'サクラマス':[25,75],'サケ':[40,110],'イトウ':[50,160],'ブラウントラウト':[15,100],'ブルックトラウト':[10,65],'カジカ':[4,20],'アカザ':[4,12],'アブラハヤ':[4,15],'タカハヤ':[4,13],'ムギツク':[5,18],'シマドジョウ':[5,15],'ホトケドジョウ':[3,8],'アジメドジョウ':[4,12],'ウナギ':[30,140],'テナガエビ':[3,18],'サワガニ':[2,5],'カワアナゴ':[8,30],'ボウズハゼ':[4,20],'ヌマチチブ':[4,15],'カワヨシノボリ':[2,7],'トウヨシノボリ':[2,9],'スナヤツメ':[8,20],'ネコギギ':[6,14],'アユカケ':[5,25],'ビワマス':[20,70],'オショロコマ':[8,40],'ゴギ':[8,35],'カラフトマス':[30,75]
};
export const rarityForSize=max=>max<=15?0:max<=40?1:max<=100?2:max<=220?3:4;
export const compareFish=(a,b)=>a.max-b.max||a.rarity-b.rarity||a.min-b.min||a.id-b.id;
