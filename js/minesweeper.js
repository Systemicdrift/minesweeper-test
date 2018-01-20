
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
    let neighbors = [];

    console.log('index, tile: ', index, tile)

    if(tile == "B") {
        //$(".tile > span").parent().removeClass('closed').addClass('open');
        $(".tile").removeClass('closed').addClass('open');
        alert('you lose');
        lostState = true;
    } else {
        nodes.push(index);
        // ran out of time working on this....
        // while(nodes.length) {
        //     let node = nodes.pop();
        //     for(let x=-1; x < 2; x++) {
        //         for(let y=-1; y < 2; y++) {
        //             if(x == 0 && y == 0) {
        //                 let elem = $("div[data-index=" + node +"]");
        //                 toggleTile(elem);
        //                 continue;
        //             }
        //             let pos = x * config.startX + y;
        //             let item = config.boardMeta[index + pos];
        //             if(item == 0) {
        //                 nodes.push(item);
        //             }
        //         }
        //     }
        // }
        toggleTile(el, tile);
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
