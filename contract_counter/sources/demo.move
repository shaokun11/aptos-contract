module self::demo108 {

    struct Counter has key {
         count: u64
    }

    fun init_module(resource_signer: &signer) {
        move_to(resource_signer, Counter {
                count:0
        });
    }

    #[view]
    public fun get_counter(): u64 acquires Counter {
        borrow_global<Counter>(@self).count
    }

    public entry fun increase(_account: signer) acquires Counter {
        let old_count = borrow_global_mut<Counter>(@self);
        old_count.count = old_count.count + 1;
    }
}