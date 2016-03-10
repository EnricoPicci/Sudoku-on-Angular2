System.register(['./decision'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var decision_1;
    var DecisionTree;
    return {
        setters:[
            function (decision_1_1) {
                decision_1 = decision_1_1;
            }],
        execute: function() {
            DecisionTree = (function () {
                function DecisionTree(_board) {
                    this.decisionLog = new Array();
                    this.board = _board;
                }
                DecisionTree.prototype.reset = function () {
                    while (this.currentDecision != null) {
                        this.currentDecision.reset();
                        this.currentDecision = this.currentDecision.parent;
                    }
                    this.currentDecision = this.root;
                };
                DecisionTree.prototype.undoLastDecision = function () {
                    if (this.currentDecision != null) {
                        this.currentDecision.reset();
                        this.currentDecision = this.currentDecision.parent;
                    }
                };
                DecisionTree.prototype.nextDecision = function () {
                    this.currentDecision = new decision_1.Decision(this.board.getFirstUndefinedCell(), this.currentDecision);
                    if (this.root == null)
                        this.root = this.currentDecision;
                    this.currentDecision.perform();
                    this.decisionLog.push("N " + this.currentDecision.cell.toString());
                    return this.currentDecision;
                };
                DecisionTree.prototype.changeDecision = function () {
                    this.currentDecision = this.currentDecision.change();
                    this.decisionLog.push("C " + this.currentDecision.cell.toString());
                    return this.currentDecision;
                };
                DecisionTree.prototype.isForBoard = function (_board) {
                    return this.board == _board;
                };
                return DecisionTree;
            }());
            exports_1("DecisionTree", DecisionTree);
        }
    }
});
//# sourceMappingURL=decisionTree.js.map