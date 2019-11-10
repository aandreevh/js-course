const fs = require('fs');

class Graph{

  constructor(){
    this._verts =[];
  }

  connect(u,v,w){
    this._verts[u] = this._verts[u] || [];
    this._verts[u][v] = this._verts[u][v] || [];
    this._verts[u][v] = w;
  }

  get(u,v){
    if(v === undefined)return this._verts[u] || []; 
    return this.get(u)[v] || NaN;
  }
}

function readInput(filename,callback) {
  fs.readFileSync(filename,'utf8').split(/\n+/g).forEach((s)=>{
    let [op, ...dat] = s.split(/\s+/g).filter(s => s.length !=0);
    if(!op.startsWith('#'))callback(op,...dat);
   });

}

class GraphBuilder{

  constructor(){
    this._graph = new Graph();
  }

  static simpleGraph(){
    return new GraphBuilder();
  }

  loadFile(filename){
    readInput("graph",(op,u,v,w)=>{
      u = parseInt(u);
      v = parseInt(v);
      w = parseInt(w);
      switch(op){
        case 'd':
          this._graph.connect(u,v,w);
          this._graph.connect(v,u,w);
        break;
        case 's':
          this._graph.connect(u,v,w);
        break;
        default:
          
          throw new Error(`Invalid graph operation: ${op}`);
      }
    })
    return this;
  }

  withDijkstra(){
    this._graph.dijkstra = function (u,v) {
      let [visited,data,queue] = [[],[],[]];

      visited.push(u);
      queue.push([0,u,0]);
      while(queue.length >0){

          queue = queue.sort(([,,w1],[,,w2])=> w1-w2); //slow af >( 
          let [[pt,ut,wt],...qq] = queue;
          queue= qq;
          
          if(visited[ut])continue;
           
          visited[ut] = true;
          data[ut] = [pt,wt];

          if(ut == v)break;
          for(let e in this.get(ut)){

            queue.push([ut,e,wt+this.get(ut,e)]);   
          }
        }
        
        let [totw,cur,path] =[(data[v] || [])[1] || NaN,v,[]];


        if(data[cur]){
        path.push(v);
        while(cur != u){
          cur =data[cur][0];
          path.push(cur);
        }
      }
        return [totw,path];
      
    }.bind(this._graph);
    return this;
  }

  build(){
    return this._graph;
  }
}


let graph =  GraphBuilder.simpleGraph().loadFile("./graph").withDijkstra().build();

readInput("input",(op,u,v)=>{
  if(op != '?') throw new Error("Invalid input data format");
  [w,path] = graph.dijkstra(parseInt(u),parseInt(v));
  console.log(`From ${u} to ${v} -> ${w} with path: ${path}`);
  
})