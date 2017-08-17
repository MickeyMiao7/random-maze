class UnionSet{
    constructor(size){
        this.set = new Array(size);
        this.record = -1
        for(let i = 0; i < this.set.length; i++)
            this.set[i] = -1;
    }

    union(root1, root2){
        if(this.set[root1] === -1 && this.set[root2] == -1){
            this.record ++;
            this.set[root1] = this.record;
            this.set[root2] = this.record;
        }
        else if(this.set[root1] === -1 && this.set[root2] !== -1){
            this.set[root1] = this.set[root2];
        }
        else if(this.set[root1] !== -1 && this.set[root2] === -1){
            this.set[root2] = this.set[root1];
        }
        else{
            let v = this.set[root1]; 
            for(let i = 0; i < this.set.length; i++)
                if (this.set[i] === v)
                    this.set[i] = this.set[root2];
        }
    }

    sameSet(x, y){
        return this.set[x] !== -1 && this.set[y] !== -1 && this.set[x] === this.set[y];
    }

}

class Maze{
    constructor(row, col, canvas){
        this.row = row;
        this.col = col;
        this.canvas = canvas;
        this.cells = row * col;
        this.linkedMap = {};
        this.unionSet = new UnionSet(this.cells);
    }

    generate(){
        while(!this.firstLastLinked()){
            var cellPair = this.pickRandomCellPair();
            if(!this.unionSet.sameSet(cellPair[0], cellPair[1])){
                this.unionSet.union(cellPair[0], cellPair[1]);
                this.addLinkedMap(cellPair[0], cellPair[1]);
            }
        }
    }

    firstLastLinked(){
        return this.unionSet.sameSet(0, this.cells - 1);
    }

    pickRandomCellPair(){
        var index = Math.random() * this.cells >> 0;
        var neighbors = [];
        var row = index / this.col >> 0;
        var col = index % this.row; 
        if(row !== 0)
            neighbors.push(index - this.col);
        if(row !== this.row -1)
            neighbors.push(index + this.col);
        if(col !== 0)
            neighbors.push(index - 1);
        if(col !== this.col -1)
            neighbors.push(index + 1);
        var neighbor = neighbors[Math.random() * neighbors.length >> 0];
        return [index, neighbor];
        
    }

    addLinkedMap(x, y){
        if(!this.linkedMap[x])
            this.linkedMap[x] = [];
        if(!this.linkedMap[y])
            this.linkedMap[y] = [];
        if(this.linkedMap[x].indexOf(y) < 0)
            this.linkedMap[x].push(y);
        if(this.linkedMap[y].indexOf(x) < 0)
            this.linkedMap[y].push(x);
    }

    draw(){
        var cellWidth = this.canvas.width / this.col,
            cellHeight = this.canvas.height / this.row;
        
        var ctx = this.canvas.getContext("2d");
        // Avoid fuzzy 
        ctx.translate(0.5, 0.5);
        ctx.beginPath();
        for(var i = 0; i < this.cells; i++){
            var row = i / this.col >> 0,
                col = i % this.col;
            // Right
            if((!this.linkedMap[i] || this.linkedMap[i].indexOf(i + 1) < 0)){
                ctx.moveTo((col + 1) * cellWidth >> 0, row * cellHeight >> 0);
                ctx.lineTo((col + 1) * cellWidth >> 0, (row + 1) * cellHeight >> 0);
            }
            // Down
            if((!this.linkedMap[i] || this.linkedMap[i].indexOf(i + this.col) < 0)){
                ctx.moveTo(col * cellWidth >> 0, (row + 1) * cellHeight >> 0);
                ctx.lineTo((col + 1) * cellWidth >> 0, (row + 1) * cellHeight >> 0);
            }            

        }
        ctx.stroke();
        ctx.closePath();
        
        this.drawBorders(ctx, cellWidth, cellHeight);
        this.drawPath(ctx, cellWidth, cellHeight);
    }

    drawBorders(ctx, cellWidth, cellHeight){
        ctx.beginPath();
        // Left
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.canvas.height);

        // Right
        ctx.moveTo(this.canvas.width - 1, 0);
        ctx.lineTo(this.canvas.width - 1, this.canvas.height - (cellHeight >> 0))    ;
        
        // Up
        ctx.moveTo(cellWidth >> 0, 0);
        ctx.lineTo(this.canvas.width, 0);
        
        // Down
        ctx.moveTo(0, this.canvas.height -1 );
        ctx.lineTo(this.canvas.width, this.canvas.height -1);
        
        ctx.stroke();
        ctx.closePath();
       
    }

    drawPath(ctx, cellWidth, cellHeight){
        ctx.beginPath();
        var path = this.getPath();
        for(var i = 0; i < path.length; i++)
            for(var j = i; j < path.length; j++){
                if (this.linkedMap[path[i]].indexOf(path[j]) === -1)
                    continue 
                var index = path[i] < path[j] ? path[i] :path[j];
                var row = index / this.col >> 0,
                    col = index % this.col;
                ctx.moveTo((col + 0.5) * cellWidth, (row + 0.5) * cellHeight);
                if(Math.abs(path[i] - path[j]) === 1){
                    ctx.lineTo((col + 1.5) * cellWidth, (row + 0.5) * cellHeight);
                }
                if(Math.abs(path[i] - path[j]) === this.col){
                    ctx.lineTo((col + 0.5) * cellWidth, (row + 1.5) * cellHeight);
                }
                
            }
        ctx.moveTo(cellWidth / 2 >> 0, 0);
        ctx.lineTo(cellWidth / 2 >> 0, cellHeight / 2 >> 0);


        ctx.moveTo(this.canvas.width - cellWidth / 2 >> 0, this.canvas.height - cellHeight / 2 >> 0);
        ctx.lineTo(this.canvas.width, this.canvas.height - cellHeight / 2 >> 0);

        ctx.strokeStyle = "Red";
        ctx.stroke();
        ctx.closePath();
    }

    getPath(){
        var map = this.linkedMap;
        var toVisit = [0];
        var pathTable = new Array(this.cells);
        for(var i = 0; i < pathTable.length; i++)
            pathTable[i] = {visited: false, prevCell: -1};
        while(!pathTable[this.cells - 1].visited)
            while(toVisit.length){
                var cell = toVisit.pop()
                for(var i = 0; i < map[cell].length; i++){
                    if(pathTable[map[cell][i]].visited) 
                        continue;
                    pathTable[map[cell][i]].visited = true;
                    pathTable[map[cell][i]].prevCell = cell;
                    toVisit.unshift(map[cell][i]);                   
                    if(pathTable[pathTable.length - 1].visited)
                        break;
                }
            }

        var cell = this.cells - 1;
        var path = [cell];
        while(cell !== 0){
            var cell = pathTable[cell].prevCell;
            path.push(cell);
        }
        console.log(path);
        return path;
    }
}

