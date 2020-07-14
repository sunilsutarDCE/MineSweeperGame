
// Creating canvas 
function Canvas(row, col){
    this.row = row;
    this.col = col;   
    this.spaces = [];    
    this.isFinished = false;
    this.spacesCleared = 0;
    this.mineCount = 8;

    // Rendering boxes using draw function
    this.draw = function() {
        var spaces = "";
        for (i = 1; i <= row; i++) {
            for (j = 1; j <= col; j++) {
                spaces = spaces.concat('<div class="space" data-row="' + i + '" data-col="' + j + '">&nbsp;</div>');
            }
            spaces = spaces.concat('<br />');
        }
        $('#canvas').empty();
        $('#canvas').append(spaces);
    }


    // 
    this.click = function (target_elem) {
        var row = $(target_elem).attr("data-row");
        var col = $(target_elem).attr("data-col");

        // Check if game finished , if true return
        if (this.isFinished === true) {
            return;
        }

        // Check if box visited , if true return
        if (this.spaces[row - 1][col - 1].visited == true) {
            return;
        }

        // Check space object values 
        if (this.spaces[row - 1][col - 1].contains == -1) {
            this.mineFound(); // if spaces.contains= -1 then found mine found
        } else if (this.spaces[row - 1][col - 1].contains == 0) {
            this.clear(row - 1, col - 1);
            uncoverNeighbours.call(this, row - 1, col - 1);
        } else {
            this.clear(row - 1, col - 1);
        }

        console.log(this.spaces);
    }

    // Mine found , show all mines and finish game
   this.mineFound = function() {
        for (i = 0; i < this.row; i++) {
            for (j = 0; j < this.col; j++) {
                if (this.spaces[i][j].contains == -1) {
                    var dom_target = $("div").find("[data-row='" + (i + 1) + "'][data-col='" + (j + 1) + "']"); 
                    $(dom_target).addClass('mine');
                    $(dom_target).html('&nbsp;');
                }
            }
        }
        this.isFinished = true;
        $('#new-game').show();
    }

    // Show number of mines near of given co-ordinates
    var numMineNear = function(row, col) {
        var sum = 0;

        if (this.spaces[row][col].contains == -1) {
            return -1;
        }

        sum = sum + valueAt.call(this, row - 1, col - 1) + valueAt.call(this, row - 1, col) + valueAt.call(this, row - 1, col + 1) 
            + valueAt.call(this, row, col - 1) + valueAt.call(this, row, col + 1) 
            + valueAt.call(this, row + 1, col - 1) + valueAt.call(this, row + 1, col) + valueAt.call(this, row + 1, col + 1);

        return sum;
    }

    // It returns value at given co-ordinates
    function valueAt(row, col) {
        if (row < 0 || row >= this.row || col < 0 || col >= this.col) {
            return 0;
        } else if(this.spaces[row][col].contains == -1){
            return 1;
        } else {
            return 0;
        }
    }

    //Initializing the spaces Object & setting up mines
    if (this.spaces !== undefined) {
        this.spaces = new Array(this.row);

        for (i = 0; i < this.row; i++) {
            this.spaces[i] = new Array(this.col);
            for (j = 0; j < this.col; j++) {
                this.spaces[i][j] = new Space(false, 0);
            }
        }

        var min = 1;
        var max = this.row * this.col;
        for (i = 0; i < this.mineCount; i++) {
            var mineIndex = Math.round(Math.random() * (max - 1));
            var x = Math.floor(mineIndex / this.col);
            var y = mineIndex % this.col;
            this.spaces[x][y] = new Space(false, -1);
        }

        for (i = 0; i < this.row; i++) {
            for (j = 0; j < this.col; j++) {
                this.spaces[i][j].contains = numMineNear.call(this, i, j);
            }
        }
    }

    this.clear = function (row, col) {
        var dom_target = $("div").find("[data-row='" + (row + 1) + "'][data-col='" + (col + 1) + "']"); 
        $(dom_target).addClass('safe');
        if (this.spaces[row][col].contains > 0) {
            $(dom_target).text(this.spaces[row][col].contains);
        } else {
            $(dom_target).html('&nbsp');
        }
        checkAllCellsVisited.call(this);
        this.spacesCleared++;
        this.spaces[row][col].visited = true;
    }

    
    function checkAllCellsVisited(){
        if (this.row * this.col - this.spacesCleared == this.mineCount) {
            for (i = 0; i < this.row; i++) {
                for (j = 0; j < this.col; j++) {
                    if (this.spaces[i][j].contains == -1) {
                        this.isFinished = true;
                        $('#new-game').show();
                    }
                }
            }
        }
    }

    // uncover neighbours of given co-ordinates
    function uncoverNeighbours(row, col) {
        checkSpace.call(this, row - 1, col - 1); 
        checkSpace.call(this, row - 1, col); 
        checkSpace.call(this, row - 1, col + 1);
        checkSpace.call(this, row, col - 1); 
        checkSpace.call(this, row, col + 1);
        checkSpace.call(this, row + 1, col - 1); 
        checkSpace.call(this, row + 1, col); 
        checkSpace.call(this, row + 1, col + 1);
        checkAllCellsVisited.call(this);
    }

    function checkSpace(row, col) {
        if (row < 0 || row >= this.row || col < 0 || col >= this.col || this.spaces[row][col].visited == true) {
            return;
        } else if (this.spaces[row][col].contains >= 0) {
            this.clear(row, col);
            if (this.spaces[row][col].contains == 0) {
                uncoverNeighbours.call(this, row, col);
                return;
            }
        }
    }
}

