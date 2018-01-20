
const config = {};
let lostState = 0;

function reset() {
    lostState = 0;
    $("#board").html('');
    buildBoard($, config);
}

function buildBoard($, config) {
    let board = config.board;
    let numTiles = config.startX * config.startY;
    let boardMeta = generateBoard(numTiles, config.bombs);
    
    config.boardMeta = boardMeta;
    board.width(config.tileWidth * config.startX);
    console.log(boardMeta)

    for(let i = 0; i < numTiles; i++) {
        let tile = $(config.tileTpl);
        tile.data('index', i);
        tile.attr('name', i);
        console.log('***** index: ', tile)
        tile.data('val', boardMeta[i]);
        if(boardMeta[i] == "B") {
            tile.html('<span>'+ i + ': '+ boardMeta[i] +'</span>');
        } else {
            tile.html(boardMeta[i]);
        }
        
        board.append(tile);
    }
}

function generateBoard(num, bombs) {
    if(!num || !bombs) {
        throw "Can't generate the board, num:" + num + " bombs:" + bombs;
    }
    let tiles = Array(num);
    tiles.fill(0);

    while(bombs) {
        let i = Math.floor(Math.random() * num);
        if(tiles[i] == 0) {
            tiles[i] = 'B';
            bombs--;
        }
    }
    for(let j = 0; j < tiles.length; j++) {
        let count = 0;
        let other = "";
        for(let x=-1; x < 2; x++) {
            for(let y=-1; y < 2; y++) {
                let pos = j + (x * config.startX + y);
                if((x == 0 && y == 0)
                    || pos < 0
                    || pos > tiles.length
                    || ((j + 1) % config.startX == 0 && y > 0)
                    || ((j) % config.startX == 0 && y < 0)
                )
                {
                    continue;
                }
                
                let item = tiles[pos];
                if(item == "B") {
                    count++;
                }
                
            }
        }
        if(tiles[j] != "B") {
            tiles[j] = count;
        }
    }
    return tiles;
}

function checkTile(element) {
    if(lostState) {
        return;
    }
    let el = $(element);
    let counter = 0;
    let index = el.data('index');
    let tile = config.boardMeta[index];
    let nodes = [];
    let visited = [];
    let reveal = [];

    console.log('index, tile: ', index, $(element).data('index'))

    if(tile == "B") {
        //$(".tile > span").parent().removeClass('closed').addClass('open');
        $(".tile").removeClass('closed').addClass('open');
        alert('you lose');
        lostState = true;
    } else {
        nodes.push(index);
        while(nodes.length) {
            let node = nodes.pop();
            if(config.boardMeta[node]) {
                reveal.push(node);
                break;
            }
            let curIndex = node;
            for(let x=-1; x < 2; x++) {
                for(let y=-1; y < 2; y++) {
                    let pos = curIndex + (x * config.startX + y);
                    if(pos > config.boardMeta.length
                        || ((curIndex + 1) % config.startX == 0 && y > 0)
                        || ((curIndex) % config.startX == 0 && y < 0)
                    ) {
                        continue;
                    }
                    let item = config.boardMeta[pos];
                    if(item == 0 && visited.indexOf(pos) < 0) {
                        reveal.push(pos);
                        nodes.push(pos);
                    } else if(item != "B" && visited.indexOf(pos) < 0) {
                        console.log('pushing reveal', item)
                        reveal.push(pos);
                    }
                    visited.push(pos);
                }
            }
        }
        console.log('reveal ', reveal)
        reveal.forEach((node)=>{
            let elem = $("div[name=" + node +"]");
            toggleTile(elem);
        })
        
        //toggleTile(el, tile);
    }
}


function toggleTile(el) {
    el.removeClass('closed').addClass('open');
}

function checkNeighbors(index) {
    let neighbors = [];
    let nodes = [];
    
    return neighbors;
}

$(document).ready(function() {
    config.board = $("#board");
    config.boardPieces = [];
    config.startX = 5;
    config.startY = 5;
    config.bombs = 5;
    config.tileWidth = 102;
    config.tileTpl = '<div class="closed tile" onclick="checkTile(this)"></div>';
    buildBoard($, config);
});
