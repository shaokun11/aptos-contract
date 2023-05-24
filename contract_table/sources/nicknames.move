module friends::nicknames {
    use std::error;
    use std::signer;
    use std::string::String;
    use aptos_std::table::{Self, Table};

    const ENOT_INITIALIZED: u64 = 0;

    struct Nicknames has key {
        // A map of friends' nicknames to wallet addresses.
        nickname_to_addr: Table<String, address>
    }

    /// Initialize Inner to the caller's account.
    public entry fun initialize(account: &signer) {
        let nicknames = Nicknames {
            nickname_to_addr: table::new(),
        };
        move_to(account, nicknames);
    }

    /// Initialize Inner to the caller's account.
    public entry fun add(account: &signer, nickname: String, friend_addr: address) acquires Nicknames {
        let signer_addr = signer::address_of(account);
        assert!(exists<Nicknames>(signer_addr), error::not_found(ENOT_INITIALIZED));
        let nickname_to_addr = &mut borrow_global_mut<Nicknames>(signer_addr).nickname_to_addr;
        table::add(nickname_to_addr, nickname, friend_addr);
    }
}