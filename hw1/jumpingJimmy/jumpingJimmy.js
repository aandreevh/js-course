function jumpingJimmy(tower, jumpHeight) {
    return  tower.reduce(([acc,en], el) => (en = en && (jumpHeight >= el))? [(acc+ el),en] : [acc,en],
     [0,true])[0];
 }