 //Space Object
function Space(visited, contains){
    this.visited = visited; 
    this.contains = contains; // 0 = space , -1=bomb , number = bombs near
}

 // Start => Creates a board object and handle click event
 function newGame() {
    board = new Canvas(6, 8);
    board.draw();
    board.isFinished = false;

    $('.space').click(function (eventObject) {
       // console.log(eventObject);
        board.click(eventObject.target);
    });

    return board;
}
