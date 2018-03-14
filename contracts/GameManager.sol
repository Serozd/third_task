pragma solidity ^0.4.17;
import { RockPaperScissors } from './RockPaperScissors.sol';

interface RockPaperScissorsRemote{
  function resolveWinner() public view returns (int8);
}

contract GameManager {
  struct UsersBalance{
    uint256 balance;
    uint256 frozenBalance;
  }
  uint256 gameId;
  struct GameInstance{
    RockPaperScissors game;
    uint256 bet;
    bool paidOut;
  }
  mapping(address => UsersBalance) public balances;
  mapping(uint256 => GameInstance) public gameList;

  event SolutionRevealed(address player);

  function charge() public  payable {
    balances[msg.sender].balance += msg.value;
  }

  function withdraw() public  {
    msg.sender.transfer(balances[msg.sender].balance);
  }


  function GameManager() public {
    gameId = 0;
  }

  function createGame(address p1, address p2, uint256 bet) public  returns (address,uint256){
    require(balances[p1].balance >= bet);
    require(balances[p2].balance >= bet);
    balances[p1].balance -= bet;
    balances[p2].balance -= bet;
    balances[p1].frozenBalance += bet;
    balances[p2].frozenBalance += bet;
    RockPaperScissors g = new RockPaperScissors(p1, p2);
    gameId++;
    gameList[gameId] = GameInstance(g, bet, false);

    return (g, gameId);
  }

  function collectWinnings(uint256 game_id) public {
    GameInstance storage matching = gameList[game_id];
    require(matching.paidOut == false);
    SolutionRevealed(address(matching.game));
    int8 result = matching.game.resolveWinner();
    uint256 bet = matching.bet;
    matching.paidOut = true;
    if (result == 1){
      balances[address(matching.game.player1())].frozenBalance -= bet;
      balances[address(matching.game.player2())].frozenBalance -= bet;
      balances[address(matching.game.player1())].balance += 2*bet;
    }
    if (result == -1){
      balances[address(matching.game.player1())].frozenBalance -= bet;
      balances[address(matching.game.player2())].frozenBalance -= bet;
      balances[address(matching.game.player2())].balance += 2*bet;
    }
    if (result == 0){
      balances[address(matching.game.player1())].frozenBalance -= bet;
      balances[address(matching.game.player2())].frozenBalance -= bet;
      balances[address(matching.game.player2())].balance += bet;
      balances[address(matching.game.player1())].balance += bet;
    }
  }
}