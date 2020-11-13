var database;
var dogImg, happyDogImg, sadDogImg;
var milkImg;
var dog, happyDog;
var foodObj;
var feedPet, addFood;
var stockFull = false;
var gameState = "hungry";
var bedroom, garden, washroom;

function preload(){
    dogImg = loadImage("assets/Dog.png");
    happyDogImg = loadImage("assets/happydog.png");
    sadDogImg = loadImage("assets/deadDog.png");
    milkImg = loadImage("assets/Milk.png");
    bedroom = loadImage("assets/Bed Room.png");
    garden = loadImage("assets/Garden.png");
    washroom = loadImage("assets/Wash Room.png");
}

function setup(){
    var canvas = createCanvas(800,500);
    database = firebase.database();

    dog = createSprite(600,250);
    dog.addImage(dogImg);
    dog.scale = 0.2;

    foodObj = new Food();
    foodObj.getStock();
    foodObj.getLastFed();
    console.log(foodObj);

    feedPet = createButton("Feed Shifu");
    addFood = createButton("Restock Milk");

    feedPet.position(650, 80);
    addFood.position(750, 80);

    feedPet.mousePressed(()=>{
        stockFull = false;
        foodObj.deductFood();
        foodObj.updateStock(foodObj.foodStock);
    })

    addFood.mousePressed(()=>{
        if(foodObj.foodStock < 30){
            foodObj.foodStock += 1;
            foodObj.updateStock(foodObj.foodStock);
        } else {
            stockFull = true;
        }
    })

    database.ref("gameState").on("value", function(snapshot){
        gameState = snapshot.val();
    })


}

function draw(){
    background(46, 139, 87);
    drawSprites();
    
    
    if(foodObj.lastFed != null){
        textSize(15);
        fill("white");
        var displayTime = foodObj.lastFed;
        if(displayTime > 12){
            displayTime -= 12
            displayTime += " PM"
        } else {
            displayTime += " AM"
        }
        text("Last Feed : " + displayTime, 200, 47);
    }
    if(foodObj.foodStock === 0){
        //console.log("Food Empty");
        textSize(25);
        fill("white");
        text("Stock is empty, please add more milk. Click on Restock to add food!", 20,100);
    }
    if(stockFull){
        //console.log("Food Empty");
        textSize(25);
        fill("white");
        text("Stock is FULL, CANNOT add more milk. Click on Feed to deduct food!", 10,100);
    }

    
    currentTime = int(hour());
    //console.log(currentTime)
    if(currentTime === foodObj.lastFed + 1){
        foodObj.garden();
        gameState = "playing";
    } else if(currentTime === foodObj.lastFed + 2){
        foodObj.bedroom();
        gameState = "sleeping";
    } else if(currentTime > foodObj.lastFed + 2 && currentTime < foodObj.lastFed + 4){
        foodObj.washroom();
        gameState = "bathing";
    } else {
        gameState = "hungry";
        if(foodObj.foodStock != undefined){
            foodObj.display();
        }
    }

    if(gameState !== "hungry"){
        feedPet.hide();
        addFood.hide();
        dog.visible = false;
    } else {
        feedPet.show();
        addFood.show();
        dog.visible = true;
        if(foodObj.fed){
            dog.addImage(happyDogImg);
        } else{
            dog.addImage(sadDogImg);
        }
    }


}

function updateState(state){
    database.ref("/").update({
        gameState : state
    })
}


