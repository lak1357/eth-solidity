// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract Election {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct Voter {
        bool authorized;
        bool voted;
        uint256 vote;
    }

    address public owner;
    string public electionName;
    mapping(address => Voter) public voters;
    Candidate[] public candidates;
    uint256 public totalVotes;

    constructor(string memory _name) {
        owner = msg.sender;
        electionName = _name;
    }

    function addCandidate(string memory _candidateName) public ownerOnly {
        candidates.push(Candidate(_candidateName, 0));
    }

    function getNumCandidates() public view returns (uint256) {
        return candidates.length;
    }

<<<<<<< HEAD:election/contracts/Election.sol
    function getCadidate(uint256 _index) public view returns (string memory) {
        return candidates[_index].name;
    }

    function authorize(address _person) public ownerOnly {
=======
    function getCadidate(uint _index) public view returns(string memory){
        return candidates[_index].name;
    }

    function authorize(address _person) ownerOnly public {
>>>>>>> 09dc09655337f2a41e13cc59c8d8b637b6c03b3e:Election/Election.sol
        voters[_person].authorized = true;
    }

    function vote(uint256 candidateIndex) public canVote {
        voters[msg.sender].voted = true;
        voters[msg.sender].vote = candidateIndex;
        candidates[candidateIndex].voteCount += 1;
        totalVotes += 1;
    }

<<<<<<< HEAD:election/contracts/Election.sol
    function end() public ownerOnly {
=======

    function end() ownerOnly public {
>>>>>>> 09dc09655337f2a41e13cc59c8d8b637b6c03b3e:Election/Election.sol
        selfdestruct(payable(owner));
    }

    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }

    modifier canVote() {
        require(voters[msg.sender].authorized);
        require(!voters[msg.sender].voted);
        _;
    }
}
