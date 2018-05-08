pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";


interface IUpgradableBridge {
    function process(bytes message) public;
}


contract UpgradableBridgeProxy is IUpgradableBridge, Ownable {

    function process(bytes message) public {
        m_impl.process(message);
    }

    function setImplementation(address impl) public onlyOwner {
        m_impl = IUpgradableBridge(impl);
    }

    IUpgradableBridge m_impl;
}



contract UpgradableBridge is IUpgradableBridge {

    modifier onlyProxy {
        require(msg.sender == m_proxy);
        _;
    }


    function UpgradableBridge(address proxy) public {
        m_proxy = proxy;
    }

    function process(bytes message) public onlyProxy {
        bytes32 hash = keccak256(message);

        uint signed = getNumMessagesSigned(hash) + 1;
        setNumMessagesSigned(hash, signed);
    }


    function getNumMessagesSigned(bytes32 hash) public view returns (uint) {
        return m_numMessagesSigned[hash];
    }

    function setNumMessagesSigned(bytes32 hash, uint new_value) private {
        m_numMessagesSigned[hash] = new_value;
    }


    mapping (bytes32 => uint) m_numMessagesSigned;

    address m_proxy;
}


contract UpgradableBridgeSecondVersion is IUpgradableBridge {

    modifier onlyProxy {
        require(msg.sender == m_proxy);
        _;
    }


    function UpgradableBridgeSecondVersion(address proxy, UpgradableBridge previous) public {
        m_proxy = proxy;
        m_previous = previous;
    }

    function process(bytes message) public onlyProxy {
        bytes32 hash = keccak256(message);

        uint signed = getNumMessagesSigned(hash) + 42;
        setNumMessagesSigned(hash, signed);
    }


    function getNumMessagesSigned(bytes32 hash) public view returns (uint) {
        return m_receivedNumMessagesSigned[hash] ? m_numMessagesSigned[hash]: m_previous.getNumMessagesSigned(hash);
    }

    function setNumMessagesSigned(bytes32 hash, uint new_value) private {
        m_numMessagesSigned[hash] = new_value;
        if (! m_receivedNumMessagesSigned[hash])
            m_receivedNumMessagesSigned[hash] = true;
    }


    mapping (bytes32 => uint) m_numMessagesSigned;
    mapping (bytes32 => bool) m_receivedNumMessagesSigned;

    address m_proxy;
    UpgradableBridge m_previous;
}
