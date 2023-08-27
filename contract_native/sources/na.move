module self::na01 {
    use std::string::{Self,String};
    use std::vector;
    use aptos_std::aptos_hash::keccak256;
    // use aptos_std::evm::{Self};

    #[view]
    public fun evm_hash(str: String):vector<u8>  {
        keccak256(*string::bytes(&str))
    }

    // #[view]
    // public fun evm_chain_id():u256  {
    //     evm::chain_id()
    // }
    #[view]
    public fun shr1(c_: u64): u64 {
        c_ / 8
    }

    #[view]
    public fun shr(c_: u64, data: vector<u8>): vector<u8> {
        let res = vector::empty<u8>();
        let s:  u64 = 0;
        let c : u64 = (256 - c_) / 8;
        while (s < c) {
            vector::push_back(&mut res, *vector::borrow(&data, s));
            s = s +1;
        };   
        res
    }

    #[view]
    public fun shl(c_: u64, data: vector<u8>): vector<u8> {
        let res = vector::empty<u8>();
        let s:  u64 = 0;
        let c : u64 = c_ / 8;
        while (s < c) {
            vector::push_back(&mut res, *vector::borrow(&data, s));
            s = s +1;
        };   
        res
    }
}