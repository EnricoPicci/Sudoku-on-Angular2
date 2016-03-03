System.register(['./decisionTree', './iterationExcess', './contraddiction', './inconsistency'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var decisionTree_1, iterationExcess_1, contraddiction_1, inconsistency_1;
    var Player;
    return {
        setters:[
            function (decisionTree_1_1) {
                decisionTree_1 = decisionTree_1_1;
            },
            function (iterationExcess_1_1) {
                iterationExcess_1 = iterationExcess_1_1;
            },
            function (contraddiction_1_1) {
                contraddiction_1 = contraddiction_1_1;
            },
            function (inconsistency_1_1) {
                inconsistency_1 = inconsistency_1_1;
            }],
        execute: function() {
            Player = (function () {
                function Player() {
                    this.maxIterations = 10000;
                }
                Player.prototype.solve = function (_board, _maxIterations, _resetDecisionTree) {
                    if (_maxIterations == null) {
                        _maxIterations = this.maxIterations;
                    }
                    if (_resetDecisionTree == null) {
                        _resetDecisionTree = true;
                    }
                    var iterations = 0;
                    this.checkConsistency(_board);
                    this.setIdentifiedValues(_board);
                    if (_board.isFinished())
                        return iterations;
                    if (_resetDecisionTree || this.decisionTree == null)
                        this.decisionTree = new decisionTree_1.DecisionTree(_board);
                    iterations = this.iterateSolution(_board, _maxIterations);
                    this.checkConsistency(_board);
                    return iterations;
                };
                Player.prototype.tryAnotherSolution = function (_board, _maxIterations) {
                    if (_maxIterations == null) {
                        _maxIterations = this.maxIterations;
                    }
                    if (this.decisionTree != null) {
                        if (!this.decisionTree.isForBoard(_board))
                            throw new Error("Decision tree for a different board");
                        else
                            this.decisionTree.changeDecision();
                    }
                    return this.iterateSolution(_board, _maxIterations);
                };
                Player.prototype.bringBackToOriginalBoardLayout = function (_board) {
                    if (this.decisionTree != null) {
                        if (!this.decisionTree.isForBoard(_board))
                            throw new Error("Decision tree for a different board");
                        this.decisionTree.reset();
                    }
                };
                Player.prototype.undoLastDecision = function (_board) {
                    if (this.decisionTree != null) {
                        if (!this.decisionTree.isForBoard(_board))
                            throw new Error("Decision tree for a different board");
                        this.decisionTree.undoLastDecision();
                    }
                };
                Player.prototype.iterateSolution = function (_board, _maxIterations) {
                    var iterations = 0;
                    if (_maxIterations == null) {
                        _maxIterations = this.maxIterations;
                    }
                    while (_board.notFinished()) {
                        if (iterations > _maxIterations) {
                            throw new iterationExcess_1.IterationExcess("Max number of iterations exceeded (" + iterations + ")");
                        }
                        iterations++;
                        this.performNextDecision(_board);
                    }
                    return iterations;
                };
                Player.prototype.performNextDecision = function (_board) {
                    var decision = this.decisionTree.nextDecision();
                    var hasContraddiction = false;
                    do {
                        try {
                            hasContraddiction = false;
                            this.setIdentifiedValues(_board, decision);
                        }
                        catch (ex) {
                            if (ex instanceof contraddiction_1.Contraddiction) {
                                console.log(ex.message);
                                decision = this.decisionTree.changeDecision();
                                hasContraddiction = true;
                            }
                            else {
                                throw (ex);
                            }
                        }
                    } while (hasContraddiction);
                };
                Player.prototype.setIdentifiedValues = function (_board, _decision) {
                    var performLoop;
                    do {
                        performLoop = false;
                        for (var i = 0; i < _board.cells.length; i++) {
                            for (var j = 0; j < _board.cells.length; j++) {
                                var cell = _board.cells[i][j];
                                performLoop = performLoop || cell.identifyAndSetValue(_decision);
                            }
                        }
                    } while (performLoop);
                };
                Player.prototype.checkConsistency = function (_board) {
                    // first of all clean previous states
                    for (var i = 0; i < _board.rows.length; i++) {
                        _board.rows[i].isInconsistent = false;
                    }
                    for (var i = 0; i < _board.columns.length; i++) {
                        _board.columns[i].isInconsistent = false;
                    }
                    for (var i = 0; i < _board.squareSets.length; i++) {
                        _board.squareSets[i].isInconsistent = false;
                    }
                    // then check the consistency
                    for (var i = 0; i < _board.rows.length; i++) {
                        var row = _board.rows[i];
                        this.checkConsistencyInRowColumnSet(row, "row");
                    }
                    for (var i = 0; i < _board.columns.length; i++) {
                        var column = _board.columns[i];
                        this.checkConsistencyInRowColumnSet(column, "column");
                    }
                    for (var i = 0; i < _board.squareSets.length; i++) {
                        var squareSet = _board.squareSets[i];
                        this.checkConsistencyInRowColumnSet(squareSet, "squareSet");
                    }
                };
                Player.prototype.checkConsistencyInRowColumnSet = function (_rowColumnSet, _type) {
                    var oneToNine = new Array(9);
                    for (var i = 0; i < _rowColumnSet.cells.length; i++) {
                        var cell = _rowColumnSet.cells[i];
                        if (cell.isValueSet()) {
                            var val = cell.val;
                            if (oneToNine[val - 1] != null) {
                                _rowColumnSet.isInconsistent = true;
                                throw new inconsistency_1.Inconsistency("Inconsistency in " + _type + " " + _rowColumnSet.index);
                            }
                            else
                                oneToNine[val - 1] = val.toString();
                        }
                    }
                };
                return Player;
            }());
            exports_1("Player", Player);
        }
    }
});
//# sourceMappingURL=player.js.map