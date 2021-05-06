function rand_int(lower, upper) {
    return Math.floor((Math.random() * upper) + lower);
}
/*
[x-1][y-1]
[x-1][y]
[x-1][y+1]
[x][y-1]
[x][y+1]
[x+1][y-1]
[x+1][y]
[x+1][y+1]
 */

class Game {
    x;
    y;
    mine_count;

    flag_count;

    board;
    display_board;
    flag_board;
    reveal_board;

    game_over;

    constructor(x, y, mine_count) {
        this.x = x;
        this.y = y;
        this.mine_count = mine_count;
        this.flag_count = 0;

        this.board = this.create_init_board(0);
        this.display_board = this.create_init_board('_');
        this.flag_board = this.create_init_board(false);
        this.reveal_board = this.create_init_board(false);

        //construct board
        for(let placed=0; placed<this.mine_count;) {
            let rand_x = rand_int(0, this.x);
            let rand_y = rand_int(0, this.y);
            if(this.board[rand_x][rand_y] === 9)
                continue;
            this.board[rand_x][rand_y] = 9;
            this.reveal_board[rand_x][rand_y] = true;
            placed++;
        }
        for(let i=0; i<this.x; i++) {
            for(let j=0; j<this.y; j++) {
                if(this.board[i][j] !== 0)
                    continue;
                this.board[i][j] = this.count_nearby(this.board, i, j, 9);
            }
        }
        //constructed board
        console.log('constructed new game');
        console.log(this.board);
        console.log(this.display_board);
        console.log(this.flag_board);
        console.log(this.reveal_board);
    }

    create_init_board(init) {
        let board = new Array(this.x);
        for(let i=0; i<this.x; i++) {
            board[i] = new Array(this.y);
        }

        for(let i=0; i<this.x; i++) {
            for(let j=0; j<this.y; j++) {
                board[i][j] = init;
            }
        }
        return board;
    }
    access_board(x, y) {
        if (x < 0 || y < 0)
            return -1;
        if (x >= this.x || y >= this.y)
            return -1;
        if (this.board[x][y] === undefined) {
            console.log(undefined)
            return -1;
        }
        return this.board[x][y];
    }
    count_nearby(board, x, y, to_count) {
        let count = 0;

        if(this.access_board(x-1,y-1) !== -1)
            if(board[x-1][y-1] === to_count)
                count++;
        if(this.access_board(x-1,y) !== -1)
            if(board[x-1][y] === to_count)
                count++;
        if(this.access_board(x-1,y+1) !== -1)
            if(board[x-1][y+1] === to_count)
                count++;
        if(this.access_board(x,y-1) !== -1)
            if(board[x][y-1] === to_count)
                count++;
        if(this.access_board(x,y+1) !== -1)
            if(board[x][y+1] === to_count)
                count++;
        if(this.access_board(x+1,y-1) !== -1)
            if(board[x+1][y-1] === to_count)
                count++;
        if(this.access_board(x+1,y) !== -1)
            if(board[x+1][y] === to_count)
                count++;
        if(this.access_board(x+1,y+1) !== -1)
            if(board[x+1][y+1] === to_count)
                count++;

        return count;
    }
    check_win() {
        if(this.game_over)
            return;
        console.log('check_win()');
        for(let i=0; i<this.x; i++) {
            for(let j=0; j<this.y; j++) {
                if(!this.reveal_board[i][j])
                    return false;
                //if(this.display_board[i][j] === '_' || this.display_board[i][j] === '?')
                //    if(this.board[i][j] === 9)
                //        return false;
            }
        }
        alert('win');
        this.game_over = true;
        return true;
    }

    reveal(x, y) {
        console.log('win:', this.check_win());
        //this.draw_board(this.reveal_board);

        if(this.game_over) {
            alert('game over');
            return;
        }
        let val = this.access_board(x, y);
        if(val === -1)
            return;
        this.reveal_board[x][y] = true;
        if (this.flag_board[x][y])
            return;

        if(val === 9) {
            this.display_board[x][y] = '*';
            console.log("game over");
            this.game_over = true;
            return;
        }

        //reveal neighbors on 0
        if(val === 0 && this.display_board[x][y] === '_') {
            this.display_board[x][y] = val;

            this.reveal(x-1,y-1);
            this.reveal(x-1,y);
            this.reveal(x-1,y+1);
            this.reveal(x,y-1);
            this.reveal(x,y+1);
            this.reveal(x+1,y-1);
            this.reveal(x+1,y);
            this.reveal(x+1,y+1);
            return;
        }

        //reveal neighbors on reveal on already revealed cell with correct flags
        if(this.count_nearby(this.display_board, x, y, '?') === this.display_board[x][y]) {
            if(this.access_board(x-1,y-1) !== -1)
                if(!this.reveal_board[x-1][y-1])
                    this.reveal(x-1,y-1);
            if(this.access_board(x-1,y) !== -1)
                if(!this.reveal_board[x-1][y])
                    this.reveal(x-1,y);
            if(this.access_board(x-1,y+1) !== -1)
                if(!this.reveal_board[x-1][y+1])
                    this.reveal(x-1,y+1);
            if(this.access_board(x,y-1) !== -1)
                if(!this.reveal_board[x][y-1])
                    this.reveal(x,y-1);
            if(this.access_board(x,y+1) !== -1)
                if(!this.reveal_board[x][y+1])
                    this.reveal(x,y+1);
            if(this.access_board(x+1,y-1) !== -1)
                if(!this.reveal_board[x+1][y-1])
                    this.reveal(x+1,y-1);
            if(this.access_board(x+1,y) !== -1)
                if(!this.reveal_board[x+1][y])
                    this.reveal(x+1,y);
            if(this.access_board(x+1,y+1) !== -1)
                if(!this.reveal_board[x+1][y+1])
                    this.reveal(x+1,y+1);
        }

        this.display_board[x][y] = val;
    }

    draw_board(board) {
        for(let i=0; i<this.y; i++) {
            let str = '';
            for(let j=0; j<this.x; j++) {
                str += board[j][i] + ' ';
            }
            console.log(str);
        }
    }

    generate_html_table(tbody_id) {
        let old_tbody = document.getElementById(tbody_id);
        let new_tbody = document.createElement('tbody');
        new_tbody.id = tbody_id;

        for(let i=0; i<this.y; i++) {
            let row = new_tbody.insertRow();
            for(let j=0; j<this.x; j++) {
                let cell = row.insertCell();

                let node = document.createElement('img');
                node.src = 'resources/blank.bmp';
                node.name = '' + j + ':' + i;
                node.x_val = j;
                node.y_val = i;
                node.onclick = () => {
                    this.update_html_table(j, i, 'reveal');
                    this.check_win();
                    if(this.game_over)
                        this.redraw_html_board();
                }
                node.oncontextmenu = () => {
                    this.update_html_table(j, i, 'flag');
                    return false;
                }


                cell.appendChild(node);
            }
        }
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
    }
    update_html_table(x, y, mode) {
        console.log(x, y, mode);
        switch(mode) {
            case 'reveal':
                this.reveal(x, y);
                this.redraw_html_board();
                break;
            case 'flag':
                if(!(this.display_board[x][y] === '_' || this.display_board[x][y] === '?'))
                    break;
                this.flag_board[x][y] = !this.flag_board[x][y];
                if(this.flag_board[x][y])
                    this.display_board[x][y] = '?';
                else
                    this.display_board[x][y] = '_';
                this.redraw_html_board();
                break;
            default:
                console.log('unsupported action');
        }
    }
    redraw_html_board() {
        for(let i=0; i<this.x; i++) {
            for(let j=0; j<this.y; j++) {
                let cell = document.getElementsByName(i + ':' + j)[0];
                cell.src = this.get_picture(this.display_board[i][j]);
            }
        }
    }
    get_picture(id) {
        switch (id) {
            case '_':
                return 'resources/blank.bmp';
            case '?':
                return 'resources/flag.bmp';
            case 0:
                return 'resources/0.bmp';
            case 1:
                return 'resources/1.bmp';
            case 2:
                return 'resources/2.bmp';
            case 3:
                return 'resources/3.bmp';
            case 4:
                return 'resources/4.bmp';
            case 5:
                return 'resources/5.bmp';
            case 6:
                return 'resources/6.bmp';
            case 7:
                return 'resources/7.bmp';
            case 8:
                return 'resources/8.bmp';
            case 9:
            case '*':
                return 'resources/bomb.bmp';
            default:
                return 'resources/bomb_crossed.bmp'
        }
    }
}



let debug = 1;
//let output = 'nodejs';
let output = 'html';


if(output === 'html') {
    if(debug === 0)
        console.log = () => {}

    let game = new Game(10, 10, 10);
    game.generate_html_table('tbody_1')


    document.getElementById('new_game').onclick = () => {
        let x = Number.parseInt(document.getElementById('x_in').value);
        let y = Number.parseInt(document.getElementById('y_in').value);
        let m = Number.parseInt(document.getElementById('mines_in').value);

        console.log(x);
        console.log(y);
        console.log(m);

        if(isNaN(x))
            x = 10;
        if(isNaN(y))
            y = 10;
        if(isNaN(m))
            m = 10;


        game = new Game(x, y, m);
        game.generate_html_table('tbody_1');
        game.redraw_html_board();
    }
}