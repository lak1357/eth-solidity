// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Election {

    struct Candidate {
        string name;
        uint voteCount;
    }

    struct Voter {
        bool authorized;
        bool voted;
        uint vote;
    }

    address public owner;
    string public electionName;
    mapping(address => Voter) public voters;
    Candidate[] public candidates;
    uint public totalVotes;

    constructor(string memory _name)  {
        owner = msg.sender;
        electionName = _name;
    }

    function addCandidate(string memory _candidateName) ownerOnly public{
        candidates.push(Candidate(_candidateName,0));
    }

    function getNumCandidates() public view returns(uint){
        return candidates.length;
    }

    function authorize(address _person) ownerOnly public {
        voters[_person].authorized = true;
    }

    function vote(uint candidateIndex) canVote public {
        voters[msg.sender].voted = true;
        voters[msg.sender].vote = candidateIndex;
        candidates[candidateIndex].voteCount += 1;
        totalVotes += 1;
    }

    function end() ownerOnly public {
        selfdestruct(payable(owner));
    }

    modifier ownerOnly(){
        require(msg.sender == owner);
        _;
    }

    modifier canVote(){
        require(voters[msg.sender].authorized);
        require(!voters[msg.sender].voted);
        _;
    }

}