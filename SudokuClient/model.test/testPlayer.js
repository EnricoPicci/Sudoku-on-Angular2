System.register(['../model/player', '../model/board'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var player_1, board_1;
    var TestPlayer, testPlayer;
    return {
        setters:[
            function (player_1_1) {
                player_1 = player_1_1;
            },
            function (board_1_1) {
                board_1 = board_1_1;
            }],
        execute: function() {
            TestPlayer = (function () {
                function TestPlayer() {
                    this.createBoardAndSetValues();
                    this.calculateAllowedValues();
                    this.identifyAndSetValues();
                    this.solve_1();
                    this.solve_2();
                    this.solve_3();
                    this.solve_4();
                    this.checkInconsistency();
                    //this.solve_5();
                    //this.solve_6();
                    this.solve_7();
                    this.solve_8();
                    console.log('Test suite completed');
                }
                TestPlayer.prototype.createBoardAndSetValues = function () {
                    var board = new board_1.Board();
                    board.setValue(0, 0, 1);
                    board.setValue(8, 8, 2);
                    var cell;
                    cell = board.rows[0].cells[0];
                    if (cell.val != 1)
                        throw new Error("Error in test");
                    cell = board.columns[8].cells[8];
                    if (cell.val != 2)
                        throw new Error("Error in test");
                    cell = board.squareSets[8].cells[8];
                    if (cell.val != 2)
                        throw new Error("Error in test");
                    return board;
                };
                TestPlayer.prototype.calculateAllowedValues = function () {
                    var allowedValues = this.createBoardAndSetValues().columns[8].cells[7].calculateAllowedValues();
                    if (allowedValues.indexOf(2) >= 0)
                        throw new Error("Error in test");
                    if (allowedValues.length != 8)
                        throw new Error("Error in test");
                };
                // create a board where the value of cell (0,7) is determined by the values present in row 0 and column 7
                TestPlayer.prototype.createBoard1 = function () {
                    var board = new board_1.Board();
                    // set the first 7 cells of row 0 with values from 1 to 7
                    for (var i = 0; i < 7; i++) {
                        board.setValue(0, i, i + 1);
                    }
                    // set the 7th cell of row 4 with value 8
                    board.setValue(4, 7, 8);
                    return board;
                };
                TestPlayer.prototype.identifyAndSetValues = function () {
                    var board = this.createBoard1();
                    var cell = board.rows[0].cells[7];
                    if (!cell.identifyAndSetValue())
                        throw new Error("Error in test");
                    if (cell.val != 9)
                        throw new Error("Error in test");
                    cell = board.rows[0].cells[8];
                    if (cell.val != 0)
                        throw new Error("Error in test");
                };
                TestPlayer.prototype.solve_1 = function () {
                    var player = new player_1.Player();
                    var board = this.createBoard1();
                    player.solve(board);
                    var cell;
                    cell = board.rows[0].cells[7];
                    if (cell.val != 9)
                        throw new Error("Error in test");
                    cell = board.rows[0].cells[8];
                    if (cell.val != 8)
                        throw new Error("Error in test");
                };
                TestPlayer.prototype.createBoard2 = function () {
                    var board = new board_1.Board();
                    board.setValue(0, 2, 7);
                    board.setValue(0, 4, 1);
                    board.setValue(0, 5, 9);
                    board.setValue(0, 7, 4);
                    board.setValue(2, 0, 3);
                    board.setValue(5, 0, 2);
                    board.setValue(8, 0, 6);
                    board.setValue(1, 1, 5);
                    board.setValue(1, 4, 8);
                    board.setValue(3, 5, 3);
                    board.setValue(5, 5, 4);
                    board.setValue(5, 6, 9);
                    board.setValue(5, 8, 5);
                    board.setValue(8, 4, 7);
                    return board;
                };
                TestPlayer.prototype.solve_2 = function () {
                    var player = new player_1.Player();
                    var board = this.createBoard2();
                    player.solve(board);
                    var cell;
                    cell = board.rows[0].cells[0];
                    if (cell.val != 8)
                        throw new Error("Error in test");
                    cell = board.rows[5].cells[4];
                    if (cell.val != 6)
                        throw new Error("Error in test");
                };
                TestPlayer.prototype.createBoard3 = function () {
                    var board = new board_1.Board();
                    board.setValue(2, 1, 5);
                    board.setValue(2, 3, 3);
                    board.setValue(2, 4, 2);
                    board.setValue(2, 5, 7);
                    board.setValue(3, 2, 3);
                    board.setValue(3, 3, 9);
                    board.setValue(3, 4, 8);
                    board.setValue(3, 5, 4);
                    board.setValue(3, 6, 7);
                    board.setValue(3, 7, 6);
                    board.setValue(4, 3, 7);
                    board.setValue(4, 5, 1);
                    board.setValue(5, 2, 7);
                    board.setValue(5, 3, 2);
                    board.setValue(5, 5, 5);
                    board.setValue(5, 6, 1);
                    board.setValue(6, 1, 2);
                    board.setValue(6, 7, 3);
                    board.setValue(7, 0, 5);
                    board.setValue(7, 1, 7);
                    board.setValue(7, 7, 8);
                    board.setValue(7, 8, 6);
                    return board;
                };
                TestPlayer.prototype.solve_3 = function () {
                    var player = new player_1.Player();
                    var board = this.createBoard3();
                    player.solve(board);
                };
                TestPlayer.prototype.createBoard4 = function () {
                    var board = new board_1.Board();
                    board.setValue(0, 0, 4);
                    board.setValue(0, 8, 7);
                    board.setValue(1, 1, 8);
                    board.setValue(1, 2, 2);
                    board.setValue(1, 6, 1);
                    board.setValue(1, 7, 9);
                    board.setValue(2, 0, 1);
                    board.setValue(2, 2, 9);
                    board.setValue(2, 6, 4);
                    board.setValue(2, 8, 6);
                    board.setValue(3, 3, 5);
                    board.setValue(3, 5, 1);
                    board.setValue(4, 3, 8);
                    board.setValue(4, 5, 6);
                    board.setValue(6, 1, 1);
                    board.setValue(6, 2, 5);
                    board.setValue(6, 6, 2);
                    board.setValue(6, 7, 6);
                    board.setValue(7, 3, 4);
                    board.setValue(7, 5, 9);
                    board.setValue(8, 0, 6);
                    board.setValue(8, 4, 1);
                    board.setValue(8, 5, 5);
                    board.setValue(8, 8, 9);
                    return board;
                };
                TestPlayer.prototype.solve_4 = function () {
                    var player = new player_1.Player();
                    var board = this.createBoard4();
                    player.solve(board);
                    player.tryAnotherSolution(board);
                };
                TestPlayer.prototype.createInconsistentBoard = function () {
                    var board = new board_1.Board();
                    board.setValue(0, 0, 4);
                    board.setValue(0, 8, 7);
                    board.setValue(0, 3, 4);
                    return board;
                };
                TestPlayer.prototype.checkInconsistency = function () {
                    var inconsistencyCought = false;
                    var player = new player_1.Player();
                    var board = this.createInconsistentBoard();
                    try {
                        player.solve(board);
                    }
                    catch (ex) {
                        inconsistencyCought = true;
                    }
                    if (!inconsistencyCought)
                        throw new Error("Error in test");
                };
                TestPlayer.prototype.createBoard5 = function () {
                    var board = new board_1.Board();
                    board.setValue(0, 0, 3);
                    board.setValue(0, 2, 2);
                    board.setValue(0, 6, 5);
                    board.setValue(1, 0, 9);
                    board.setValue(2, 5, 9);
                    board.setValue(2, 6, 3);
                    board.setValue(2, 7, 8);
                    board.setValue(2, 8, 6);
                    board.setValue(3, 0, 5);
                    board.setValue(3, 1, 4);
                    board.setValue(3, 2, 3);
                    board.setValue(3, 4, 1);
                    board.setValue(4, 2, 6);
                    board.setValue(4, 4, 8);
                    board.setValue(4, 6, 2);
                    board.setValue(5, 4, 7);
                    board.setValue(5, 6, 4);
                    board.setValue(5, 8, 3);
                    board.setValue(6, 0, 6);
                    board.setValue(6, 1, 1);
                    board.setValue(6, 3, 3);
                    board.setValue(6, 5, 7);
                    board.setValue(7, 6, 9);
                    board.setValue(7, 7, 6);
                    board.setValue(7, 8, 4);
                    //			board.setValue(8,2,8);
                    //			board.setValue(8,6,7);
                    //			board.setValue(8,8,1);
                    return board;
                };
                TestPlayer.prototype.solve_5 = function () {
                    var player = new player_1.Player();
                    var board = this.createBoard5();
                    player.solve(board);
                    var i = 0;
                    while (true) {
                        player.tryAnotherSolution(board);
                        i++;
                    }
                };
                TestPlayer.prototype.createBoard6 = function () {
                    var board = new board_1.Board();
                    board.setValue(0, 0, 8);
                    board.setValue(0, 1, 4);
                    board.setValue(0, 7, 9);
                    board.setValue(0, 8, 7);
                    board.setValue(1, 3, 8);
                    board.setValue(1, 5, 9);
                    board.setValue(2, 3, 6);
                    board.setValue(2, 5, 5);
                    board.setValue(3, 4, 1);
                    board.setValue(4, 0, 3);
                    board.setValue(4, 1, 5);
                    board.setValue(4, 3, 9);
                    board.setValue(4, 5, 8);
                    board.setValue(4, 7, 2);
                    board.setValue(4, 8, 1);
                    board.setValue(5, 1, 2);
                    board.setValue(5, 2, 6);
                    board.setValue(5, 6, 9);
                    board.setValue(5, 7, 7);
                    board.setValue(7, 2, 4);
                    board.setValue(7, 6, 1);
                    board.setValue(8, 2, 9);
                    board.setValue(8, 6, 7);
                    return board;
                };
                TestPlayer.prototype.solve_6 = function () {
                    var player = new player_1.Player();
                    var board = this.createBoard6();
                    player.solve(board);
                    var i = 0;
                    while (true) {
                        player.tryAnotherSolution(board);
                        i++;
                    }
                };
                TestPlayer.prototype.createBoard7 = function () {
                    var board = new board_1.Board();
                    board.setValue(0, 3, 6);
                    board.setValue(0, 5, 4);
                    board.setValue(0, 7, 9);
                    board.setValue(1, 4, 5);
                    board.setValue(1, 6, 1);
                    board.setValue(1, 8, 6);
                    board.setValue(2, 0, 6);
                    board.setValue(2, 1, 3);
                    board.setValue(2, 5, 8);
                    board.setValue(2, 6, 5);
                    board.setValue(2, 7, 7);
                    board.setValue(3, 1, 1);
                    board.setValue(3, 3, 8);
                    board.setValue(3, 4, 4);
                    board.setValue(3, 6, 9);
                    board.setValue(3, 8, 7);
                    board.setValue(4, 0, 3);
                    board.setValue(4, 3, 1);
                    board.setValue(4, 5, 6);
                    board.setValue(4, 8, 2);
                    board.setValue(5, 0, 8);
                    board.setValue(5, 2, 4);
                    board.setValue(5, 4, 7);
                    board.setValue(5, 5, 5);
                    board.setValue(5, 7, 3);
                    board.setValue(6, 1, 2);
                    board.setValue(6, 2, 3);
                    board.setValue(6, 3, 5);
                    board.setValue(6, 7, 1);
                    board.setValue(6, 8, 8);
                    board.setValue(7, 0, 5);
                    board.setValue(7, 2, 7);
                    board.setValue(7, 4, 8);
                    board.setValue(8, 1, 8);
                    board.setValue(8, 3, 7);
                    board.setValue(8, 5, 2);
                    return board;
                };
                TestPlayer.prototype.solve_7 = function () {
                    var player = new player_1.Player();
                    var board = this.createBoard7();
                    player.solve(board);
                };
                TestPlayer.prototype.createBoard8 = function () {
                    var board = new board_1.Board();
                    board.setValue(0, 0, 5);
                    board.setValue(0, 1, 1);
                    board.setValue(0, 8, 2);
                    board.setValue(1, 0, 7);
                    board.setValue(1, 1, 4);
                    board.setValue(1, 4, 2);
                    board.setValue(1, 5, 8);
                    board.setValue(2, 1, 6);
                    board.setValue(3, 2, 8);
                    board.setValue(3, 3, 3);
                    board.setValue(3, 7, 6);
                    board.setValue(3, 8, 7);
                    board.setValue(4, 3, 5);
                    board.setValue(4, 5, 2);
                    board.setValue(5, 0, 6);
                    board.setValue(5, 1, 5);
                    board.setValue(5, 5, 7);
                    board.setValue(5, 6, 2);
                    board.setValue(6, 7, 7);
                    board.setValue(7, 3, 1);
                    board.setValue(7, 4, 7);
                    board.setValue(7, 7, 2);
                    board.setValue(7, 8, 4);
                    board.setValue(8, 0, 3);
                    board.setValue(8, 7, 9);
                    board.setValue(8, 8, 5);
                    return board;
                };
                TestPlayer.prototype.solve_8 = function () {
                    var player = new player_1.Player();
                    var board = this.createBoard8();
                    player.solve(board);
                };
                return TestPlayer;
            }());
            exports_1("TestPlayer", TestPlayer);
            testPlayer = new TestPlayer();
        }
    }
});
//module.exports = testPlayer; 
//# sourceMappingURL=testPlayer.js.map