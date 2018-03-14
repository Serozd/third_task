pragma solidity ^0.4.17;

contract RockPaperScissors {
  struct PlayersChoise {
    bytes32 encryptedVote;
    bytes32 plaintextVote;
  }
  event MoveRevield(address, uint8);

  mapping(address => PlayersChoise) public moves;
  address public player1;
  address public player2;
  uint8 public playersJoined = 0;
  uint8 public maxPlayers = 2;

  bool public phase = false;

  modifier phaseOne() {
    require(phase == false);
    require(playersJoined < maxPlayers);
     _;
  }

  modifier phaseTwo() {
    require(phase == true);
    require(playersJoined < maxPlayers);
     _;
  }
  
  modifier onlyPlayer() {
    require(msg.sender == player1 || msg.sender == player2);  
      _;
  }

  function RockPaperScissors(address p1, address p2) public {
    require(p1 != 0);
    require(p2 != 0);
    player1 = p1;
    player2 = p2;
  }

  function play(bytes32 votehash) public payable phaseOne onlyPlayer {
    
    moves[msg.sender] = PlayersChoise(votehash, '');
    playersJoined++;
    if (playersJoined == maxPlayers) {
      phase = true;
      playersJoined = 0;
    }
  }

  function reveal(bytes32 vote) public payable phaseTwo onlyPlayer {
    require(moves[msg.sender].encryptedVote == keccak256(vote));
    moves[msg.sender].plaintextVote = vote;
    MoveRevield(msg.sender, uint8(moves[msg.sender].plaintextVote[0]));
    playersJoined++;
  }

  function  resolveWinner() public view returns (int8) {
    if ((maxPlayers == playersJoined) && phase){
      address[2] memory players = [player1, player2];
      uint8[2] memory playersResults;
      int8[3] memory solutions = [int8(0), -1, 1];
      for (uint8 i=0;i<2; i++ ){
          playersResults[i] = uint8(moves[players[i]].plaintextVote[0]);
      }
      return  solutions[(playersResults[0]+ playersResults[1])%3];
    }
  }
}
