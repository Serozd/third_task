pragma solidity ^0.4.17;
import { RockPaperScissors } from './RockPaperScissors.sol';

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

  struct GameProposal {
    address player1;
    address player2;
    uint256 block_id;
    uint256 bet;
    bool accepted;
    bool created;
  }
  mapping(address => UsersBalance) public balances;
  mapping(uint256 => GameInstance) public gameList;
  GameProposal[] public proposals;

  event SolutionRevealed(address game, address player);
  event FundsWithdrawed(address player, uint256 amount);

  function charge() public  payable {
    balances[msg.sender].balance += msg.value;
  }

  function withdraw() public  {
    uint256 amount = balances[msg.sender].balance;
    balances[msg.sender].balance = 0;
    FundsWithdrawed(msg.sender, amount);
    msg.sender.transfer(amount);
  }


  function GameManager() public {
    gameId = 0;
  }

  function propose(address p2, uint256 bet) public returns (uint256){
    require(balances[msg.sender].balance>=bet);
    proposals.push(GameProposal(msg.sender, p2, uint256(block.number), bet, false, false));
    return uint256(proposals.length);
  }

  function acceptGame(uint256 id) public {
    GameProposal current =  proposals[id];
    require(msg.sender == current.player2);
    require(balances[msg.sender].balance>=current.bet);
    current.accepted = true;

  }


  function createGame(uint256 proposal) public  returns (address,uint256){
    GameProposal current =  proposals[proposal];
    require(current.accepted);
    require(balances[current.player1].balance >= current.bet);
    require(balances[current.player2].balance >= current.bet);
    balances[current.player1].balance -= current.bet;
    balances[current.player2].balance -= current.bet;
    balances[current.player1].frozenBalance += current.bet;
    balances[current.player2].frozenBalance += current.bet;
    RockPaperScissors g = new RockPaperScissors(current.player1, current.player2);
    current.created = true;
    gameId++;
    gameList[gameId] = GameInstance(g, current.bet, false);
    return (g, gameId);
  }

  function collectWinnings(uint256 game_id) public {
    GameInstance storage matching = gameList[game_id];
    require(matching.paidOut == false);
    int8 result = matching.game.resolveWinner();
    address p1 = address(matching.game.player1());
    address p2 = address(matching.game.player2());
    
    uint256 bet = matching.bet;
    matching.paidOut = true;
    if (result == 1){
      balances[p1].frozenBalance -= bet;
      balances[p2].frozenBalance -= bet;
      balances[p1].balance += 2*bet;
      SolutionRevealed(address(matching.game), p1);
    }
    if (result == -1){
      balances[p1].frozenBalance -= bet;
      balances[p2].frozenBalance -= bet;
      balances[p2].balance += 2*bet;
      SolutionRevealed(address(matching.game), p2);
    }
    if (result == 0){
      balances[p1].frozenBalance -= bet;
      balances[p2].frozenBalance -= bet;
      balances[p2].balance += bet;
      balances[p1].balance += bet;
      SolutionRevealed(address(matching.game), address(matching.game));
    }
  }
}