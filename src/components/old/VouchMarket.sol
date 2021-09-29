// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

/**
 * @title ProofOfHumanity Interface
 * @dev See https://github.com/Proof-Of-Humanity/Proof-Of-Humanity.
 */
interface IProofOfHumanity {
    function getSubmissionInfo(address _submissionID)
        external
        view
        returns (
            uint8 status,
            uint64 submissionTime,
            uint64 index,
            bool registered,
            bool hasVouched,
            uint256 numberOfRequests
        );
}

contract VouchMarket {
    /** @dev To be emitted when a proposal is submitted.
     *  @param idProposal Unique identifier of the proposal.
     *  @param user The user that receives the vouch.
     *  @param amount The ETH sent by the user.
     *  @param timeLimit Time limit until the user can claim his own funds.
     *  @param voucher The person who vouch.
     */
    event LogProposal(
        uint256 indexed idProposal,
        address indexed user,
        uint256 amount,
        uint256 timeLimit,
        address voucher
    );
    /**
     *  @dev Emitted when a voucher lock a proposal.
     *  @param idProposal Unique identifier of the proposal.
     *  @param voucher The person who vouch and locks the proposal.
     */
    event LogProposalLocked(
        uint256 indexed idProposal,
        address indexed voucher
    );
    /**
     *  @dev Emitted when a proposal reward is claimed.
     *  @param idProposal Unique identifier of the proposal.
     *  @param voucher The person who vouch.
     */
    event LogRewardForVouchingClaimed(
        uint256 indexed idProposal,
        address indexed voucher
    );
    /**
     *  @dev Emitted when a vouch is not performed for this proposal.
     *  @param idProposal Unique identifier of the proposal.
     */
    event LogClaimVouchNotPerformed(uint256 indexed idProposal);
    /** @dev To be emitted when a withdrawal occurs.
     *  @param idProposal Unique identifier of the proposal.
     *  @param withdrawer The person who withdraws.
     *  @param fund The ETH sent to the person who withdraws.
     *  @param fee The contract fee.
     */
    event LogWithdrawn(
        uint256 indexed idProposal,
        address indexed withdrawer,
        uint256 fund,
        uint256 fee
    );

    // Proof of Humanity contract.
    // 0xC5E9dDebb09Cd64DfaCab4011A0D5cEDaf7c9BDb
    IProofOfHumanity private PoH =
        IProofOfHumanity(0xC2Be6008a66Beb1363f800875E03F7b0EDbD403a);
    /// @dev Divisor to calculate the fee, higher the value, higher the voucher reward
    uint256 public feeDivisor;
    /// @dev Counter of submitted proposals
    uint256 public proposalCounter;
    /// @dev Wait period to lock a new proposal, same as PoH challengePeriodDuration.
    uint256 private waitPeriodToLock;
    // Contract deployer
    address private deployer;

    struct Proposal {
        address user; //Person who need the vouch
        address voucher; //Person selected to vouch or person who lock the proposal
        uint256 amount; //Transactions cost + optional incentive + fee
        uint256 timeLimit; //If somebody lock it and not claim it, time limit to wait and withdraw your funds
    }

    /// @dev Map all the proposals by their IDs. idProposal -> Proposal
    mapping(uint256 => Proposal) public proposalMap;

    /// @dev Map the last time a user lock a proposal. voucher -> time
    mapping(address => uint256) public timeLastLockMap;

    constructor(uint256 _feeDivisor, uint256 _waitPeriodToLock) {
        deployer = msg.sender;
        feeDivisor = _feeDivisor;
        waitPeriodToLock = _waitPeriodToLock;
    }

    modifier onlyDeployer() {
        require(msg.sender == deployer, "Not deployer");
        _;
    }

    /**
     *  @dev Submit proposal.
     *  @param addedTime Time limit until the user can claim his own funds.
     *  @param voucher (Optional) The person who vouch. Address 0 to denote that anyone can vouch.
     */
    function submitProposal(uint256 addedTime, address voucher)
        external
        payable
    {
        uint256 idProposal = proposalCounter;
        Proposal storage thisProposal = proposalMap[idProposal];
        uint256 amount = msg.value;
        require(amount > 0, "money?");
        uint256 timeLimit = block.timestamp + addedTime;
        thisProposal.user = msg.sender;
        thisProposal.amount = amount;
        thisProposal.timeLimit = timeLimit;
        if (voucher != address(0)) {
            thisProposal.voucher = voucher;
            emit LogProposalLocked(idProposal, voucher);
        }
        proposalCounter++;
        emit LogProposal(idProposal, msg.sender, amount, timeLimit, voucher);
    }

    /**
     *  @dev Lock proposal before vouching it and only locker can claim it. Avoiding a vouching race.
     *  @param idProposal The ID of the proposal.
     */
    function lockProposal(uint256 idProposal) external {
        (, , , bool registered, bool hasVouched, ) =
            PoH.getSubmissionInfo(msg.sender);
        Proposal storage thisProposal = proposalMap[idProposal];
        require(thisProposal.amount > 0, "Wrong time or done");
        require(thisProposal.voucher == address(0), "Locked or assigned");
        require(registered, "Not registered"); //Avoid invalid vouch
        require(
            timeLastLockMap[msg.sender] + waitPeriodToLock < block.timestamp &&
                !hasVouched,
            "Can't vouch yet"
        ); //Avoid multiple locks at the same time or vouchers w/o available vouch
        timeLastLockMap[msg.sender] = block.timestamp;
        thisProposal.voucher = msg.sender;
        emit LogProposalLocked(idProposal, msg.sender);
    }

    /**
     *  @dev Update proposal to increase the reward and add more time.
     *  @param idProposal The ID of the proposal.
     *  @param addedTime Time limit until the user can claim his own funds.
     *  @param voucher (Optional) The person who vouch. Address 0 to denote that anyone can vouch.
     */
    function updateProposal(
        uint256 idProposal,
        uint256 addedTime,
        address voucher
    ) external payable {
        Proposal storage thisProposal = proposalMap[idProposal];
        require(thisProposal.user == msg.sender, "Nice try");
        address designedVoucher = thisProposal.voucher;
        if (thisProposal.timeLimit < block.timestamp)
            require(designedVoucher == address(0), "Wait time limit expires");
        uint256 timeLimit = block.timestamp + addedTime;
        uint256 amount = thisProposal.amount;
        if (msg.value > 0) {
            amount = thisProposal.amount + msg.value;
            thisProposal.amount = amount;
        }
        thisProposal.timeLimit = timeLimit;
        if (voucher != designedVoucher) thisProposal.voucher = voucher;
        emit LogProposal(idProposal, msg.sender, amount, timeLimit, voucher);
    }

    /**
     *  @dev After vouch for a proposal, claim the proposal reward.
     *  @param idProposal The ID of the proposal.
     */
    function claimRewardForVouching(uint256 idProposal) external {
        Proposal storage thisProposal = proposalMap[idProposal];
        address user = thisProposal.user;
        (uint8 status, , , bool registered, , ) = PoH.getSubmissionInfo(user);
        require(thisProposal.amount > 0, "Wrong time or done");
        require(thisProposal.voucher == msg.sender, "You are not the voucher");
        require(
            status == uint8(2) || registered, //status 2 is pending reg.
            "Can't claim yet"
        );
        emit LogRewardForVouchingClaimed(idProposal, msg.sender);
        pay(idProposal);
    }

    /**
     *  @dev If the user is not vouched in time limit, user can claim his own funds.
     *  @param idProposal The ID of the proposal.
     */
    function claimVouchNotPerformed(uint256 idProposal) external {
        Proposal storage thisProposal = proposalMap[idProposal];
        address user = thisProposal.user;
        require(user == msg.sender, "Nice try");
        require(
            block.timestamp > thisProposal.timeLimit && thisProposal.amount > 0,
            "Wrong time or done"
        );
        emit LogClaimVouchNotPerformed(idProposal);
        pay(idProposal);
    }

    /**
     *  @dev Calculate and withdraw the funds of the proposal.
     *  @param idProposal The ID of the proposal.
     */
    function pay(uint256 idProposal) private {
        Proposal storage thisProposal = proposalMap[idProposal];
        uint256 fee = thisProposal.amount / feeDivisor;
        uint256 fund = thisProposal.amount - fee;
        thisProposal.amount = 0;
        emit LogWithdrawn(idProposal, msg.sender, fund, fee);
        (bool successTx1, ) = deployer.call{value: fee}("");
        require(successTx1, "Tx1 fail");
        (bool successTx2, ) = msg.sender.call{value: fund}("");
        require(successTx2, "Tx2 fail");
    }

    /**
     *  @dev Change Fee Divisor Commission Calculator.
     *  @param _feeDivisor The divisor to calculate the fee, the higher this value
     *  is, the lower the fee and the higher the reward for the voucher.
     */
    function changeFeeDivisor(uint256 _feeDivisor) external onlyDeployer {
        require(_feeDivisor >= 10);
        feeDivisor = _feeDivisor;
    }

    /**
     *  @dev Change the wait time period to lock a new proposal.
     *  @param _waitPeriodToLock period in seconds
     */
    function changeWaitPeriodToLock(uint256 _waitPeriodToLock)
        external
        onlyDeployer
    {
        waitPeriodToLock = _waitPeriodToLock;
    }
}
