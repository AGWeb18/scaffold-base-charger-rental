// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract is ReentrancyGuard {
    address public immutable owner;
    mapping(address => uint) pendingWithdrawals;

    string public greeting = "Building EV dApps!!!";

    struct RentalAppointment {
		uint rentalAppointmentId;
        address renter;
        uint startTime;
        uint endTime;
		bool isActive; // Indicates if the appointment is active

    }

	struct Charger {
        uint chargerId;
        address payable chargerOwner;
        string location;
        uint pricePerHour;
        bool available;
        mapping(uint => RentalAppointment) appointments;
        uint appointmentsCount;
		bool isActive; 
    }

    // Instantiate Charger mapping
	mapping(uint => Charger) public chargers;
	uint public chargersCount;

	// Constructor: Called once on contract deployment
	// Check packages/hardhat/deploy/00_deploy_your_contract.ts
	constructor(address _owner) {
		owner = _owner;
	}

	// Event declarations for logging activities
    event ChargerListed(uint indexed chargerId, address owner, string location, uint pricePerHour);
    event ChargerRented(uint indexed chargerId, address renter, uint startTime, uint endTime);
    event ChargerReleased(uint indexed chargerId);
	event AppointmentCreated(uint indexed chargerId, uint appointmentId, uint startTime, uint endTime);
	event ChargerStatusChanged(uint indexed chargerId, bool isActive);
    event ChargerBooked(uint indexed chargerId, address renter, uint startTime, uint endTime);
    event PaymentReceived(address from, uint amount);


	// Modifier: used to define a set of rules that must be met before or after a function is executed
	// Check the withdraw() function
	modifier isOwner() {
		// msg.sender: predefined variable that represents address of the account that called the current function
		require(msg.sender == owner, "Not the Owner");
		_;
	}

	modifier onlyChargerOwnerOrContractOwner(uint chargerId) {
		require(msg.sender == owner || msg.sender == chargers[chargerId].chargerOwner, "Not authorized");
		_;
	}

	function listCharger(string memory location, uint pricePerHour) public {
        Charger storage charger = chargers[chargersCount];
        charger.chargerId = chargersCount;
        charger.chargerOwner = payable(msg.sender);
        charger.location = location;
        charger.pricePerHour = pricePerHour;
        charger.available = true;
		charger.isActive = true;

        emit ChargerListed(chargersCount, msg.sender, location, pricePerHour);
        chargersCount++;
		
    }

	function setChargerInactive(uint chargerId) public onlyChargerOwnerOrContractOwner(chargerId) {
		Charger storage charger = chargers[chargerId];
		require(charger.isActive, "Charger already inactive");
		charger.isActive = false;
		emit ChargerStatusChanged(chargerId, false);
	}



    function bookCharger(uint chargerId, uint numHours) public payable {
        require(chargers[chargerId].isActive, "Charger is not active.");
        require(chargers[chargerId].available, "Charger is currently unavailable.");
		Charger storage charger = chargers[chargerId];
		require(msg.value >= (charger.pricePerHour * numHours), "Insufficient payment.");

        // Calculate booking period
        uint startTime = block.timestamp;
        uint endTime = startTime + (numHours * 1 hours);

        // Update charger status and appointments
        chargers[chargerId].available = false;
        uint appointmentId = chargers[chargerId].appointmentsCount++;
        chargers[chargerId].appointments[appointmentId] = RentalAppointment({
            rentalAppointmentId: appointmentId,
            renter: msg.sender,
            startTime: startTime,
            endTime: endTime,
            isActive: true
        });

        emit ChargerBooked(chargerId, msg.sender, startTime, endTime);
        emit PaymentReceived(msg.sender, msg.value);

        // Handle payment (e.g., transfer to charger owner or contract owner)
        // This is a simple transfer for illustration; consider security implications.
        (bool sent, ) = chargers[chargerId].chargerOwner.call{value: msg.value}("");
        require(sent, "Failed to send payment.");
    }

	function getAppointmentDetails(uint chargerId, uint appointmentId) public view 
		returns (
			uint id, 
			address renter, 
			uint startTime, 
			uint endTime, 
			bool isActive
		) 
	{
			require(chargerId < chargersCount, "Charger does not exist.");
			require(appointmentId < chargers[chargerId].appointmentsCount, "Appointment does not exist.");

			RentalAppointment storage appointment = chargers[chargerId].appointments[appointmentId];
			return (
				appointment.rentalAppointmentId, 
				appointment.renter, 
				appointment.startTime, 
				appointment.endTime, 
				appointment.isActive
			);
		}


	/**
	 * Function that allows the owner to withdraw all the Ether in the contract
	 * The function can only be called by the owner of the contract as defined by the isOwner modifier
	 */
	function withdraw() public isOwner {
		(bool success, ) = owner.call{ value: address(this).balance }("");
		require(success, "Failed to send Ether");
	}

	/**
	 * Function that allows the contract to receive ETH
	 */
	receive() external payable {}
}
