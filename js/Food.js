class Food{
    constructor(){
        this.foodStock = null;
        this.lastFed = null;
        this.fed= false;
    }

    getStock(){
        database.ref("food").on("value", (snapshot)=>{
            console.log(snapshot.val());
            this.foodStock = snapshot.val();
        })
    }

    getLastFed(){
        database.ref("feedTime").on("value", (snapshot)=>{
            this.lastFed = snapshot.val();
        })
    }

    updateStock(stock){
        database.ref("/").update({
            food: stock
        })
    }

    deductFood(){
        if(this.foodStock > 0){
            this.fed = true;
            this.foodStock -= 1;
            this.lastFed = int(hour());
            database.ref("/").update({
                feedTime: this.lastFed
            })
        } 
    }

    display(){
        var x = 30;
        var y = 50;
        for(var i=0; i<this.foodStock; i++){
            if(i % 10 === 0){
                x = 30;
                y += 100;
            }
            image(milkImg, x, y, 40, 60);
            x += 30;
        }
    }

    bedroom(){
        background(bedroom);
    }

    garden(){
        background(garden);
    }

    washroom(){
        background(washroom);
    }
}