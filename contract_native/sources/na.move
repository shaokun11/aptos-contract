module self::na02 {
    use std::string::{Self,String};
    use std::vector;
    use aptos_std::aptos_hash::keccak256;
    use aptos_std::evm::{Self};

    #[view]
    public fun evm_hash(str: String):vector<u8>  {
        keccak256(*string::bytes(&str))
    }

    #[view]
    public fun address_to_vector(addr: address):vector<u8>   {
        evm::address_to_vector(addr)
    }
    
}