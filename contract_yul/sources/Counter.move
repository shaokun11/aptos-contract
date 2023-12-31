module self::counter {
    use self::yul;
    use self::u256;
    use aptos_std::simple_map;
    use self::u256::U256;
    use aptos_std::simple_map::SimpleMap;
    use std::vector;

   struct T has key {
        storage: SimpleMap<U256, U256>
    }

    fun init_module(account: &signer) {
        move_to(account, T {
            storage: simple_map::new(),
        });
    }

    public entry fun call(data: vector<u8>) acquires T {
        let ret = vector::empty<u8>();
        let memory = simple_map::new<U256, U256>();
        let pstorage = borrow_global_mut<T>(@self).storage;
        let _1 = yul::memoryguard(u256::from_u64(0x80));
        yul::mstore(&mut memory,u256::from_u64(64),_1);
        if(!yul::eq(yul::iszero(yul::lt(yul::calldatasize(data),u256::from_u64(4))),u256::zero())) {
            let _2 = u256::from_u64(0);
            let m = yul::shr(u256::from_u64(224),yul::calldataload(data,_2));
            if(yul::eq(m, u256::from_u64(0x30f3f0db))) {
                if(!yul::eq(yul::callvalue(),u256::zero())) {
                    yul::revert(_2,_2);
                };
                if(!yul::eq(yul::slt(yul::add(yul::calldatasize(data),yul::not(u256::from_u64(3))),u256::from_u64(32)),u256::zero())) {
                    assert!(false, 15);
                    yul::revert(_2,_2);
                };
                let _3 = yul::sload(&mut pstorage, _2);
                let sum = yul::add(_3,yul::calldataload(data,u256::from_u64(4)));
                if(!yul::eq(yul::gt(_3,sum),u256::zero())) {
                    yul::mstore(&mut memory,_2,yul::shl(u256::from_u64(224),u256::from_u64(0x4e487b71)));
                    yul::mstore(&mut memory,u256::from_u64(4),u256::from_u64(0x11));
                    yul::revert(_2,u256::from_u64(0x24));
                };
                yul::sstore(&mut pstorage,_2,sum);
                yul::ret(&mut ret, &memory, _2,_2);
            };
        };
        borrow_global_mut<T>(@self).storage = pstorage;
    }

    #[view]
    public fun view(data: vector<u8>): vector<u8> acquires T {
        let ret = vector::empty<u8>();
        let memory = simple_map::new<U256, U256>();
        let pstorage = borrow_global_mut<T>(@self).storage;
        let _1 = yul::memoryguard(u256::from_u64(0x80));
        yul::mstore(&mut memory,u256::from_u64(64),_1);
        if(!yul::eq(yul::iszero(yul::lt(yul::calldatasize(data),u256::from_u64(4))),u256::zero())) {
            let _2 = u256::from_u64(0);
            let m = yul::shr(u256::from_u64(224),yul::calldataload(data,_2));
            if(yul::eq(m, u256::from_u64(0x06661abd))) {
                if(!yul::eq(yul::callvalue(),u256::zero())) {
                    yul::revert(_2,_2);
                };
                if(!yul::eq(yul::slt(yul::add(yul::calldatasize(data),yul::not(u256::from_u64(3))),_2),u256::zero())) {
                    yul::revert(_2,_2);
                };
                yul::mstore(&mut memory,_1,yul::sload(&mut pstorage, _2));
                yul::ret(&mut ret, &memory, _1,u256::from_u64(32));
            };
        };
        ret
    }

}