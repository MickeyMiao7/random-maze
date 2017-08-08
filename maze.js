class UnionSet{
    constructor(size){
        this.set = new Array(size);
        for(let i = 0; i < this.set.length; i++)
            this.set[i] = -1;
    }

    union(root1, root2){
        this.set[root1] = root2;
        /*
        if(this.set[root1] < this.set[root2])
            this.set[root2] = root1;
        else if(this.set[root1] === this.set[root2])
            this.set[root2]--;
        else
            this.set[root1] = this.set[root2];
        */
    }

    findSet(x){
        /*
        while(this.set[x] >= 0)
            x = this.set[x];
        return x;
        */
        if(this.set[x] < 0){
            return x;
        }
        return this.set[x] = this.findSet(this.set[x]);
    }

    sameSet(x, y){
        return this.findSet(x) === this.findSet(y);
    }

    unionElement(x, y){
        this.union(this.findSet(x), this.findSet(y));
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
        this.i = 1;
    }

    generate(){
        while(!this.firstLastLinked()){
            var cellPair = this.pickRandomCellPair();
            if(!this.unionSet.sameSet(cellPair[0], cellPair[1])){
                this.unionSet.unionElement(cellPair[0], cellPair[1]);
                this.addLinkedMap(cellPair[0], cellPair[1]);
            }
            this.i++;
            if(this.i > 50)
                break;
        }
    }

    firstLastLinked(){
        return this.unionSet.sameSet(0, this.cells - 1);
    }

    pickRandomCellPair(){
        // var cell = Math.floor(Math.random() * this.cells);
        // bitwise operators have a low operator precedence, so you can avoid a mess of parentheses.)
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
        /*
        if(!this.linkedMap[x])
            this.linkedMap[x] = [];
        if(!this.linkedMap[y])
            this.linkedMap[y] = [];
        if(this.linkedMap[x].indexOf(y) < 0)
            this.linkedMap[x].push(y);
        if(this.linkedMap[y].indexOf(x) < 0)
            this.linkedMap[y].push(x);
        */
        var a = x < y ? x : y;
        var b = x > y ? x : y;
        if(!this.linkedMap[a])
            this.linkedMap[a] = [];
        if(this.linkedMap[a].indexOf(b) < 0)
            this.linkedMap[a].push(b);
    }
}

var maze = new Maze(3, 3);
maze.generate();
console.log(maze.unionSet)
console.log(maze.linkedMap)