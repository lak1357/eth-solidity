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

    modifier ownerOnly(){
        require(msg.sender == owner);
        _;
    }

    function addCandidate(string memory _candidateName) ownerOnly public{
        candidates.push(Candidate(_candidateName,0));
    }

}