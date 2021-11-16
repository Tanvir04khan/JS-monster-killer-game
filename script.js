
const monsterHealthBar = document.getElementById('monster-health');
const playerHealthBar = document.getElementById('player-health');
const bonusLife = document.getElementById('bonus-life');

const attackBtn = document.getElementById('attack');
const strongAttackBtn = document.getElementById('strong-attack');
const healBtn = document.getElementById('heal');
const showLogBtn = document.getElementById('show-log');

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG ATTACK';
const LOG_EVENT_GAME_OVER = 'GAME OVER';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'STRONG ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER HEAL';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER ATTACK';

let battleLog = [];

let attackValue = 17;
let monsterAttackValue = 15;
let strongAttackValue = 25;
let healValue = 20;

//user input value 
function enteredMaxHealth(){  
    let maxHealth = prompt('max. health for you and monster', '100');
    let parsedValue = parseInt(maxHealth);
    if(isNaN(parsedValue) || parsedValue <= 0){
        throw{ message: 'invalid user input!, not a number.'}
    }
    return parsedValue;
}
let chosenMaxHealth;
try{
    chosenMaxHealth = enteredMaxHealth();
}catch(error){
    console.log(error);
    chosenMaxHealth = 100;
    alert('you have chosen invalid value!, using default value 100.');
}

let currentMonsterHealth = chosenMaxHealth;
let currentPlayerHealth = chosenMaxHealth;
let hasBonusLife = true;
//adjusting heath bar
function adjustHealthBar(maxHealth){
    monsterHealthBar.max = maxHealth;
    monsterHealthBar.value = maxHealth;
    playerHealthBar.max = maxHealth;
    playerHealthBar.value = maxHealth;
}

adjustHealthBar(chosenMaxHealth);

// attack function of both

function damageToMonster(damage){
    let dealtDamage = Math.random() * damage;
    monsterHealthBar.value -= dealtDamage;
    return dealtDamage; 
}

function damageToPlayer(damage){
    let dealtDamage = Math.random() * damage;
    playerHealthBar.value -= dealtDamage;
    return dealtDamage;
}

// log entry function

function writeToLog(ev, val, monsterHealth, playerHealth){
    let logEntry = {};
    switch(ev){
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry = {
                event : ev,
                value : val,
                target : 'Monster',
                monsterHealth : monsterHealth,
                playerHealth : playerHealth
            };
        break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry = {
                event : ev,
                value : val,
                target : 'Monster',
                monsterHealth : monsterHealth,
                playerHealth : playerHealth
            }
        break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry={
                event : ev,
                value : val,
                target : 'Playre',
                monsterHealth : monsterHealth,
                playerHealth : playerHealth
            }
        break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry = {
                event : ev,
                value : val,
                target : 'Player',
                monsterHealth : monsterHealth,
                playerHealth : playerHealth
            }
        break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event : ev,
                value : val,
                monsterHealth : monsterHealth,
                playerHealth : playerHealth
            }
        break;
    }
    battleLog.push(logEntry);
}

// reset function

function resetGame(value){
    playerHealthBar.value = value;
    monsterHealthBar.value = value;
}
function reset(){
    currentMonsterHealth = chosenMaxHealth;
    currentPlayerHealth = chosenMaxHealth;
    resetGame(chosenMaxHealth);
}

//end round function

function removeBonusLife(){
    bonusLife.parentNode.removeChild(bonusLife);
}

function setPlayerHealth(){
    playerHealthBar.value = 40;
    currentPlayerHealth = 40;
    
}

function endRound(){
    let player_Damage = damageToPlayer(monsterAttackValue);
    currentPlayerHealth -= player_Damage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        player_Damage,
        currentMonsterHealth,
        currentPlayerHealth
    );
    
    if(currentPlayerHealth <= 0 && hasBonusLife === true){
        hasBonusLife = false;
        removeBonusLife();
        setPlayerHealth();
        alert('you would be dead but the bonus life saved you!');
    }else
    if(currentPlayerHealth <= 0 && currentMonsterHealth > 0 ){
        alert('you lost');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'YOU LOST',
            currentMonsterHealth,
            currentPlayerHealth
        )
        reset();
    }else if(currentPlayerHealth > 0 && currentMonsterHealth <= 0){
        alert('you won');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'YOU WON',
            currentMonsterHealth,
            currentPlayerHealth
        )
        reset();
    }else if(currentPlayerHealth <= 0 && currentMonsterHealth <= 0){
        alert('a draw');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'A DRAW',
            currentMonsterHealth,
            currentPlayerHealth
            )
            reset();
        }
        
        //if(currentPlayerHealth <= 0 || currentMonsterHealth <= 0){
            //reset();
        //}

}

// attack to monster function

function attackToMonster(mode){
    let maxDamage = mode === MODE_ATTACK ? attackValue : strongAttackValue;
    let logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
    let damage = damageToMonster(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

//attack, strong attack, heal  HANDLER

function increaseHealth(hV){
    playerHealthBar.value += hV;
}

function healHandler(){
    let heal_Value;
    if(currentPlayerHealth >= chosenMaxHealth - healValue){
        alert('you cant heal more than your max health!');
        heal_Value = chosenMaxHealth - currentPlayerHealth;
    }else{
        heal_Value = healValue;
    }
    increaseHealth(heal_Value);
    currentPlayerHealth += heal_Value;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        heal_Value,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
}

function attackMonsterHandler(){
    attackToMonster(MODE_ATTACK);
}

function strongAttackHandler(){
    attackToMonster(MODE_STRONG_ATTACK);
}



function printToLog(){
    
    for(const logEntry of battleLog){
        console.log(logEntry);
    }

    
}

attackBtn.addEventListener('click', attackMonsterHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healHandler);
showLogBtn.addEventListener('click', printToLog);

